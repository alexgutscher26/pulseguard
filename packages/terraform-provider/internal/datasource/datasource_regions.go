package datasource

import (
	"context"
	"fmt"

	"github.com/getsteadystack/SteadyStack/terraform-provider-steadystack/internal/client"
	"github.com/hashicorp/terraform-plugin-framework/datasource"
	"github.com/hashicorp/terraform-plugin-framework/datasource/schema"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

var (
	_ datasource.DataSource              = &RegionsDataSource{}
	_ datasource.DataSourceWithConfigure = &RegionsDataSource{}
)

func NewRegionsDataSource() datasource.DataSource {
	return &RegionsDataSource{}
}

type RegionsDataSource struct {
	client *client.Client
}

type RegionModel struct {
	Code     types.String `tfsdk:"code"`
	Name     types.String `tfsdk:"name"`
	Location types.String `tfsdk:"location"`
	Flag     types.String `tfsdk:"flag"`
}

type RegionsDataSourceModel struct {
	Regions []RegionModel `tfsdk:"regions"`
}

func (d *RegionsDataSource) Metadata(ctx context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_regions"
}

func (d *RegionsDataSource) Schema(ctx context.Context, req datasource.SchemaRequest, resp *datasource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Data source for retrieving all available SteadyStack sovereign edge probe regions.",
		Attributes: map[string]schema.Attribute{
			"regions": schema.ListNestedAttribute{
				Description: "List of available sovereign edge probe regions.",
				Computed:    true,
				NestedObject: schema.NestedAttributeObject{
					Attributes: map[string]schema.Attribute{
						"code": schema.StringAttribute{
							Description: "The sovereign region code (e.g. wnam, enam, weur, eeur, apac).",
							Computed:    true,
						},
						"name": schema.StringAttribute{
							Description: "The region human-readable name.",
							Computed:    true,
						},
						"location": schema.StringAttribute{
							Description: "The geographic physical location of the probe node.",
							Computed:    true,
						},
						"flag": schema.StringAttribute{
							Description: "Country flag emoji.",
							Computed:    true,
						},
					},
				},
			},
		},
	}
}

func (d *RegionsDataSource) Configure(ctx context.Context, req datasource.ConfigureRequest, resp *datasource.ConfigureResponse) {
	if req.ProviderData == nil {
		return
	}
	c, ok := req.ProviderData.(*client.Client)
	if !ok {
		resp.Diagnostics.AddError("Unexpected Data Source Configure Type", fmt.Sprintf("Expected *client.Client, got: %T", req.ProviderData))
		return
	}
	d.client = c
}

func (d *RegionsDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
	var state RegionsDataSourceModel

	regions, err := d.client.GetRegions()
	if err != nil {
		resp.Diagnostics.AddError("Error Reading SteadyStack Sovereign Regions", err.Error())
		return
	}

	state.Regions = make([]RegionModel, len(regions))
	for i, r := range regions {
		state.Regions[i] = RegionModel{
			Code:     types.StringValue(r.Code),
			Name:     types.StringValue(r.Name),
			Location: types.StringValue(r.Location),
			Flag:     types.StringValue(r.Flag),
		}
	}

	diags := resp.State.Set(ctx, &state)
	resp.Diagnostics.Append(diags...)
}
