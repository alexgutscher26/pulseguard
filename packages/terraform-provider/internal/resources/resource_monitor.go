package resources

import (
	"context"
	"fmt"

	"github.com/alexgutscher26/pulseguard/terraform-provider-pulseguard/internal/client"
	"github.com/hashicorp/terraform-plugin-framework/path"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema/booldefault"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema/int64default"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema/planmodifier"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema/stringdefault"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema/stringplanmodifier"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

var (
	_ resource.Resource                = &MonitorResource{}
	_ resource.ResourceWithConfigure   = &MonitorResource{}
	_ resource.ResourceWithImportState = &MonitorResource{}
)

func NewMonitorResource() resource.Resource {
	return &MonitorResource{}
}

type MonitorResource struct {
	client *client.Client
}

type MonitorResourceModel struct {
	ID                  types.String `tfsdk:"id"`
	Name                types.String `tfsdk:"name"`
	URL                 types.String `tfsdk:"url"`
	Type                types.String `tfsdk:"type"`
	Interval            types.Int64  `tfsdk:"interval"`
	Timeout             types.Int64  `tfsdk:"timeout"`
	Status              types.String `tfsdk:"status"`
	Method              types.String `tfsdk:"method"`
	Headers             types.Map    `tfsdk:"headers"`
	Body                types.String `tfsdk:"body"`
	Tags                types.List   `tfsdk:"tags"`
	CheckRegions        types.List   `tfsdk:"check_regions"`
	AlertThreshold      types.Int64  `tfsdk:"alert_threshold"`
	DynamicThresholding types.Bool   `tfsdk:"dynamic_thresholding"`
	RunbookURL          types.String `tfsdk:"runbook_url"`
}

func (r *MonitorResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_monitor"
}

func (r *MonitorResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Manages a PulseGuard edge uptime monitor.",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "The unique identifier of the monitor.",
				Computed:    true,
				PlanModifiers: []planmodifier.String{
					stringplanmodifier.UseStateForUnknown(),
				},
			},
			"name": schema.StringAttribute{
				Description: "The display name of the monitor.",
				Required:    true,
			},
			"url": schema.StringAttribute{
				Description: "The target endpoint URL or hostname to monitor.",
				Required:    true,
			},
			"type": schema.StringAttribute{
				Description: "Monitor protocol type: HTTP, PING, PORT, SSL, DNS, HEARTBEAT. Defaults to HTTP.",
				Optional:    true,
				Computed:    true,
				Default:     stringdefault.StaticString("HTTP"),
			},
			"interval": schema.Int64Attribute{
				Description: "Check interval in seconds (e.g. 60, 30, 10). Defaults to 60.",
				Optional:    true,
				Computed:    true,
				Default:     int64default.StaticInt64(60),
			},
			"timeout": schema.Int64Attribute{
				Description: "Timeout per check in seconds. Defaults to 10.",
				Optional:    true,
				Computed:    true,
				Default:     int64default.StaticInt64(10),
			},
			"status": schema.StringAttribute{
				Description: "Current status of the monitor (UP, DOWN, PAUSED).",
				Computed:    true,
			},
			"method": schema.StringAttribute{
				Description: "HTTP method: GET, POST, HEAD, PUT, DELETE, PATCH. Defaults to GET.",
				Optional:    true,
				Computed:    true,
				Default:     stringdefault.StaticString("GET"),
			},
			"headers": schema.MapAttribute{
				Description: "Optional key-value HTTP headers sent with the request.",
				ElementType: types.StringType,
				Optional:    true,
			},
			"body": schema.StringAttribute{
				Description: "Optional request body string for HTTP POST/PUT/PATCH requests.",
				Optional:    true,
			},
			"tags": schema.ListAttribute{
				Description: "List of string tags for organizing monitors.",
				ElementType: types.StringType,
				Optional:    true,
			},
			"check_regions": schema.ListAttribute{
				Description: "List of sovereign edge regions to probe from (e.g. wnam, enam, weur, eeur, apac).",
				ElementType: types.StringType,
				Optional:    true,
			},
			"alert_threshold": schema.Int64Attribute{
				Description: "Number of consecutive failures required before triggering alert escalation.",
				Optional:    true,
				Computed:    true,
				Default:     int64default.StaticInt64(1),
			},
			"dynamic_thresholding": schema.BoolAttribute{
				Description: "Enable AI-driven dynamic latency thresholding.",
				Optional:    true,
				Computed:    true,
				Default:     booldefault.StaticBool(false),
			},
			"runbook_url": schema.StringAttribute{
				Description: "Direct URL to incident remediation runbook linked in alerts.",
				Optional:    true,
			},
		},
	}
}

func (r *MonitorResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

func (r *MonitorResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var plan MonitorResourceModel
	diags := req.Plan.Get(ctx, &plan)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	var tags []string
	if !plan.Tags.IsNull() && !plan.Tags.IsUnknown() {
		diags = plan.Tags.ElementsAs(ctx, &tags, false)
		resp.Diagnostics.Append(diags...)
	}

	var regions []string
	if !plan.CheckRegions.IsNull() && !plan.CheckRegions.IsUnknown() {
		diags = plan.CheckRegions.ElementsAs(ctx, &regions, false)
		resp.Diagnostics.Append(diags...)
	}

	var headers map[string]string
	if !plan.Headers.IsNull() && !plan.Headers.IsUnknown() {
		diags = plan.Headers.ElementsAs(ctx, &headers, false)
		resp.Diagnostics.Append(diags...)
	}

	if resp.Diagnostics.HasError() {
		return
	}

	m := &client.Monitor{
		Name:                plan.Name.ValueString(),
		URL:                 plan.URL.ValueString(),
		Type:                plan.Type.ValueString(),
		Interval:            plan.Interval.ValueInt64(),
		Timeout:             plan.Timeout.ValueInt64(),
		Method:              plan.Method.ValueString(),
		Headers:             headers,
		Body:                plan.Body.ValueString(),
		Tags:                tags,
		CheckRegions:        regions,
		AlertThreshold:      plan.AlertThreshold.ValueInt64(),
		DynamicThresholding: plan.DynamicThresholding.ValueBool(),
		RunbookURL:          plan.RunbookURL.ValueString(),
	}

	created, err := r.client.CreateMonitor(m)
	if err != nil {
		resp.Diagnostics.AddError("Error Creating PulseGuard Monitor", err.Error())
		return
	}

	plan.ID = types.StringValue(created.ID)
	plan.Status = types.StringValue(created.Status)

	if len(created.Tags) > 0 {
		tagsVal, d := types.ListValueFrom(ctx, types.StringType, created.Tags)
		resp.Diagnostics.Append(d...)
		plan.Tags = tagsVal
	} else if plan.Tags.IsNull() {
		plan.Tags = types.ListNull(types.StringType)
	}

	if len(created.CheckRegions) > 0 {
		regionsVal, d := types.ListValueFrom(ctx, types.StringType, created.CheckRegions)
		resp.Diagnostics.Append(d...)
		plan.CheckRegions = regionsVal
	} else if plan.CheckRegions.IsNull() {
		plan.CheckRegions = types.ListNull(types.StringType)
	}

	if len(created.Headers) > 0 {
		headersVal, d := types.MapValueFrom(ctx, types.StringType, created.Headers)
		resp.Diagnostics.Append(d...)
		plan.Headers = headersVal
	} else if plan.Headers.IsNull() {
		plan.Headers = types.MapNull(types.StringType)
	}

	diags = resp.State.Set(ctx, plan)
	resp.Diagnostics.Append(diags...)
}

func (r *MonitorResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var state MonitorResourceModel
	diags := req.State.Get(ctx, &state)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	m, err := r.client.GetMonitor(state.ID.ValueString())
	if err != nil {
		resp.Diagnostics.AddError("Error Reading PulseGuard Monitor", err.Error())
		return
	}

	state.Name = types.StringValue(m.Name)
	state.URL = types.StringValue(m.URL)
	state.Type = types.StringValue(m.Type)
	state.Interval = types.Int64Value(m.Interval)
	state.Timeout = types.Int64Value(m.Timeout)
	state.Status = types.StringValue(m.Status)
	state.Method = types.StringValue(m.Method)
	state.Body = types.StringValue(m.Body)
	state.AlertThreshold = types.Int64Value(m.AlertThreshold)
	state.DynamicThresholding = types.BoolValue(m.DynamicThresholding)
	state.RunbookURL = types.StringValue(m.RunbookURL)

	if len(m.Tags) > 0 {
		tagsVal, d := types.ListValueFrom(ctx, types.StringType, m.Tags)
		resp.Diagnostics.Append(d...)
		state.Tags = tagsVal
	} else {
		state.Tags = types.ListNull(types.StringType)
	}

	if len(m.CheckRegions) > 0 {
		regionsVal, d := types.ListValueFrom(ctx, types.StringType, m.CheckRegions)
		resp.Diagnostics.Append(d...)
		state.CheckRegions = regionsVal
	} else {
		state.CheckRegions = types.ListNull(types.StringType)
	}

	if len(m.Headers) > 0 {
		headersVal, d := types.MapValueFrom(ctx, types.StringType, m.Headers)
		resp.Diagnostics.Append(d...)
		state.Headers = headersVal
	} else {
		state.Headers = types.MapNull(types.StringType)
	}

	diags = resp.State.Set(ctx, &state)
	resp.Diagnostics.Append(diags...)
}

func (r *MonitorResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var plan MonitorResourceModel
	diags := req.Plan.Get(ctx, &plan)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	var tags []string
	if !plan.Tags.IsNull() && !plan.Tags.IsUnknown() {
		diags = plan.Tags.ElementsAs(ctx, &tags, false)
		resp.Diagnostics.Append(diags...)
	}

	var regions []string
	if !plan.CheckRegions.IsNull() && !plan.CheckRegions.IsUnknown() {
		diags = plan.CheckRegions.ElementsAs(ctx, &regions, false)
		resp.Diagnostics.Append(diags...)
	}

	var headers map[string]string
	if !plan.Headers.IsNull() && !plan.Headers.IsUnknown() {
		diags = plan.Headers.ElementsAs(ctx, &headers, false)
		resp.Diagnostics.Append(diags...)
	}

	if resp.Diagnostics.HasError() {
		return
	}

	m := &client.Monitor{
		Name:                plan.Name.ValueString(),
		URL:                 plan.URL.ValueString(),
		Type:                plan.Type.ValueString(),
		Interval:            plan.Interval.ValueInt64(),
		Timeout:             plan.Timeout.ValueInt64(),
		Method:              plan.Method.ValueString(),
		Headers:             headers,
		Body:                plan.Body.ValueString(),
		Tags:                tags,
		CheckRegions:        regions,
		AlertThreshold:      plan.AlertThreshold.ValueInt64(),
		DynamicThresholding: plan.DynamicThresholding.ValueBool(),
		RunbookURL:          plan.RunbookURL.ValueString(),
	}

	updated, err := r.client.UpdateMonitor(plan.ID.ValueString(), m)
	if err != nil {
		resp.Diagnostics.AddError("Error Updating PulseGuard Monitor", err.Error())
		return
	}

	plan.Status = types.StringValue(updated.Status)

	if len(updated.Tags) > 0 {
		tagsVal, d := types.ListValueFrom(ctx, types.StringType, updated.Tags)
		resp.Diagnostics.Append(d...)
		plan.Tags = tagsVal
	} else if plan.Tags.IsNull() {
		plan.Tags = types.ListNull(types.StringType)
	}

	if len(updated.CheckRegions) > 0 {
		regionsVal, d := types.ListValueFrom(ctx, types.StringType, updated.CheckRegions)
		resp.Diagnostics.Append(d...)
		plan.CheckRegions = regionsVal
	} else if plan.CheckRegions.IsNull() {
		plan.CheckRegions = types.ListNull(types.StringType)
	}

	if len(updated.Headers) > 0 {
		headersVal, d := types.MapValueFrom(ctx, types.StringType, updated.Headers)
		resp.Diagnostics.Append(d...)
		plan.Headers = headersVal
	} else if plan.Headers.IsNull() {
		plan.Headers = types.MapNull(types.StringType)
	}

	diags = resp.State.Set(ctx, plan)
	resp.Diagnostics.Append(diags...)
}

func (r *MonitorResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var state MonitorResourceModel
	diags := req.State.Get(ctx, &state)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	err := r.client.DeleteMonitor(state.ID.ValueString())
	if err != nil {
		resp.Diagnostics.AddError("Error Deleting PulseGuard Monitor", err.Error())
		return
	}
}

func (r *MonitorResource) ImportState(ctx context.Context, req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
	resource.ImportStatePassthroughID(ctx, path.Root("id"), req, resp)
}
