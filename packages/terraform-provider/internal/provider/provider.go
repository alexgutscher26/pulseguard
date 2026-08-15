package provider

import (
	"context"
	"os"

	"github.com/alexgutscher26/pulseguard/terraform-provider-pulseguard/internal/client"
	"github.com/alexgutscher26/pulseguard/terraform-provider-pulseguard/internal/datasource"
	"github.com/alexgutscher26/pulseguard/terraform-provider-pulseguard/internal/resources"
	"github.com/hashicorp/terraform-plugin-framework/datasource"
	"github.com/hashicorp/terraform-plugin-framework/path"
	"github.com/hashicorp/terraform-plugin-framework/provider"
	"github.com/hashicorp/terraform-plugin-framework/provider/schema"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

var _ provider.Provider = &PulseGuardProvider{}

type PulseGuardProvider struct {
	version string
}

type PulseGuardProviderModel struct {
	HostURL types.String `tfsdk:"host_url"`
	APIKey  types.String `tfsdk:"api_key"`
}

func New(version string) func() provider.Provider {
	return func() provider.Provider {
		return &PulseGuardProvider{
			version: version,
		}
	}
}

func (p *PulseGuardProvider) Metadata(ctx context.Context, req provider.MetadataRequest, resp *provider.MetadataResponse) {
	resp.TypeName = "pulseguard"
	resp.Version = p.version
}

func (p *PulseGuardProvider) Schema(ctx context.Context, req provider.SchemaRequest, resp *provider.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "PulseGuard provider allows managing monitors, alert channels, and status pages as code.",
		Attributes: map[string]schema.Attribute{
			"host_url": schema.StringAttribute{
				Description: "The base URL for the PulseGuard API. Defaults to https://app.pulseguard.io (or env PULSEGUARD_HOST_URL).",
				Optional:    true,
			},
			"api_key": schema.StringAttribute{
				Description: "API key for authenticating with PulseGuard (or env PULSEGUARD_API_KEY).",
				Optional:    true,
				Sensitive:   true,
			},
		},
	}
}

func (p *PulseGuardProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
	var config PulseGuardProviderModel
	diags := req.Config.Get(ctx, &config)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	hostURL := os.Getenv("PULSEGUARD_HOST_URL")
	if !config.HostURL.IsNull() {
		hostURL = config.HostURL.ValueString()
	}
	if hostURL == "" {
		hostURL = "https://app.pulseguard.io"
	}

	apiKey := os.Getenv("PULSEGUARD_API_KEY")
	if !config.APIKey.IsNull() {
		apiKey = config.APIKey.ValueString()
	}

	if apiKey == "" {
		resp.Diagnostics.AddAttributeError(
			path.Root("api_key"),
			"Missing PulseGuard API Key",
			"The provider cannot create the PulseGuard API client without an API Key. "+
				"Set the api_key value in the configuration or use the PULSEGUARD_API_KEY environment variable.",
		)
		return
	}

	c := client.NewClient(hostURL, apiKey)
	resp.DataSourceData = c
	resp.ResourceData = c
}

func (p *PulseGuardProvider) Resources(ctx context.Context) []func() resource.Resource {
	return []func() resource.Resource{
		resources.NewMonitorResource,
		resources.NewAlertChannelResource,
	}
}

func (p *PulseGuardProvider) DataSources(ctx context.Context) []func() datasource.DataSource {
	return []func() datasource.DataSource{
		datasource.NewRegionsDataSource,
	}
}
