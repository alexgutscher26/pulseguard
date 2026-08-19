{{/*
Expand the name of the chart.
*/}}
{{- define "steadystack.name" -}}
{{- default .Chart.Name .Values.global.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "steadystack.fullname" -}}
{{- if .Values.global.fullnameOverride }}
{{- .Values.global.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.global.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart label.
*/}}
{{- define "steadystack.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels.
*/}}
{{- define "steadystack.labels" -}}
helm.sh/chart: {{ include "steadystack.chart" . }}
{{ include "steadystack.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels.
*/}}
{{- define "steadystack.selectorLabels" -}}
app.kubernetes.io/name: {{ include "steadystack.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account.
*/}}
{{- define "steadystack.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "steadystack.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Web component selector labels.
*/}}
{{- define "steadystack.web.selectorLabels" -}}
app.kubernetes.io/name: {{ include "steadystack.name" . }}-web
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: web
{{- end }}

{{/*
Probe component selector labels.
*/}}
{{- define "steadystack.probe.selectorLabels" -}}
app.kubernetes.io/name: {{ include "steadystack.name" . }}-probe
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: probe
{{- end }}

{{/*
Image tag helper — falls back to Chart.AppVersion.
*/}}
{{- define "steadystack.web.imageTag" -}}
{{- .Values.web.image.tag | default .Chart.AppVersion }}
{{- end }}

{{- define "steadystack.probe.imageTag" -}}
{{- .Values.probe.image.tag | default .Chart.AppVersion }}
{{- end }}

{{/*
PostgreSQL service host when the bundled subchart is enabled, empty otherwise.
*/}}
{{- define "steadystack.postgresql.host" -}}
{{- if .Values.postgresql.enabled }}{{ printf "%s-postgresql" (include "steadystack.fullname" .) }}{{- end }}
{{- end }}

{{/*
Database connection string. An explicit secrets.databaseUrl wins; otherwise the
value is derived from the bundled PostgreSQL subchart (used for both
DATABASE_URL and DIRECT_URL).
*/}}
{{- define "steadystack.databaseUrl" -}}
{{- if .Values.secrets.databaseUrl }}
{{- .Values.secrets.databaseUrl }}
{{- else if .Values.postgresql.enabled }}
{{- printf "postgresql://%s:%s@%s-postgresql:5432/%s" .Values.postgresql.auth.username .Values.postgresql.auth.password (include "steadystack.fullname" .) .Values.postgresql.auth.database }}
{{- else }}
{{- "" }}
{{- end }}
{{- end }}
