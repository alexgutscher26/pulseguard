package resources

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/alexgutscher26/pulseguard/terraform-provider-pulseguard/internal/client"
	"github.com/hashicorp/terraform-plugin-framework/path"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema/planmodifier"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema/stringplanmodifier"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

var (
	_ resource.Resource                = &AlertChannelResource{}
	_ resource.ResourceWithConfigure   = &AlertChannelResource{}
	_ resource.ResourceWithImportState = &AlertChannelResource{}
)

func NewAlertChannelResource() resource.Resource {
	return &AlertChannelResource{}
}

type AlertChannelResource struct {
	client *client.Client
}

type AlertChannelResourceModel struct {
	ID        types.String `tfsdk:"id"`
	Name      types.String `tfsdk:"name"`
	Type      types.String `tfsdk:"type"`
	ConfigJSON types.String `tfsdk:"config_json"`
}

func (r *AlertChannelResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_alert_channel"
}

func (r *AlertChannelResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Manages a PulseGuard alert notification channel (PagerDuty, Opsgenie, Slack, Discord, Webhook, Email).",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "The unique identifier of the alert channel.",
				Computed:    true,
				PlanModifiers: []planmodifier.String{
					stringplanmodifier.UseStateForUnknown(),
				},
			},
			"name": schema.StringAttribute{
				Description: "The display name of the alert channel.",
				Required:    true,
			},
			"type": schema.StringAttribute{
				Description: "Notification channel type: PAGERDUTY, OPSGENIE, SLACK, DISCORD, WEBHOOK, EMAIL.",
				Required:    true,
			},
			"config_json": schema.StringAttribute{
				Description: "JSON encoded string with channel-specific configuration parameters.",
				Required:    true,
				Sensitive:   true,
			},
		},
	}
}

func (r *AlertChannelResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
	if req.ProviderData == nil {
		return
	}
	c, ok := req.ProviderData.(*client.Client)
	if !ok {
		resp.Diagnostics.AddError("Unexpected Resource Configure Type", fmt.Sprintf("Expected *client.Client, got: %T", req.ProviderData))
		return
	}
	r.client = c
}

func (r *AlertChannelResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var plan AlertChannelResourceModel
	diags := req.Plan.Get(ctx, &plan)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	var configMap map[string]interface{}
	if err := json.Unmarshal([]byte(plan.ConfigJSON.ValueString()), &configMap); err != nil {
		resp.Diagnostics.AddError("Invalid config_json JSON string", err.Error())
		return
	}

	ch := &client.AlertChannel{
		Name:   plan.Name.ValueString(),
		Type:   plan.Type.ValueString(),
		Config: configMap,
	}

	created, err := r.client.CreateAlertChannel(ch)
	if err != nil {
		resp.Diagnostics.AddError("Error Creating PulseGuard Alert Channel", err.Error())
		return
	}

	plan.ID = types.StringValue(created.ID)

	diags = resp.State.Set(ctx, plan)
	resp.Diagnostics.Append(diags...)
}

func (r *AlertChannelResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var state AlertChannelResourceModel
	diags := req.State.Get(ctx, &state)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	ch, err := r.client.GetAlertChannel(state.ID.ValueString())
	if err != nil {
		resp.Diagnostics.AddError("Error Reading PulseGuard Alert Channel", err.Error())
		return
	}

	state.Name = types.StringValue(ch.Name)
	state.Type = types.StringValue(ch.Type)

	configBytes, _ := json.Marshal(ch.Config)
	state.ConfigJSON = types.StringValue(string(configBytes))

	diags = resp.State.Set(ctx, &state)
	resp.Diagnostics.Append(diags...)
}

func (r *AlertChannelResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	resp.Diagnostics.AddError("Update Not Supported", "PulseGuard alert channels do not support in-place updates. Recreate the resource.")
}

func (r *AlertChannelResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var state AlertChannelResourceModel
	diags := req.State.Get(ctx, &state)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	err := r.client.DeleteAlertChannel(state.ID.ValueString())
	if err != nil {
		resp.Diagnostics.AddError("Error Deleting PulseGuard Alert Channel", err.Error())
		return
	}
}

func (r *AlertChannelResource) ImportState(ctx context.Context, req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
	resource.ImportStatePassthroughID(ctx, path.Root("id"), req, resp)
}
