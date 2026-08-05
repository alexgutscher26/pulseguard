{{/*
Expand the name of the chart.
*/}}
{{- define "pulseguard.name" -}}
{{- default .Chart.Name .Values.global.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "pulseguard.fullname" -}}
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
{{- define "pulseguard.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels.
*/}}
{{- define "pulseguard.labels" -}}
helm.sh/chart: {{ include "pulseguard.chart" . }}
{{ include "pulseguard.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels.
*/}}
{{- define "pulseguard.selectorLabels" -}}
app.kubernetes.io/name: {{ include "pulseguard.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account.
*/}}
{{- define "pulseguard.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "pulseguard.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Web component selector labels.
*/}}
{{- define "pulseguard.web.selectorLabels" -}}
app.kubernetes.io/name: {{ include "pulseguard.name" . }}-web
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: web
{{- end }}

{{/*
Probe component selector labels.
*/}}
{{- define "pulseguard.probe.selectorLabels" -}}
app.kubernetes.io/name: {{ include "pulseguard.name" . }}-probe
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: probe
{{- end }}

{{/*
Image tag helper — falls back to Chart.AppVersion.
*/}}
{{- define "pulseguard.web.imageTag" -}}
{{- .Values.web.image.tag | default .Chart.AppVersion }}
{{- end }}

{{- define "pulseguard.probe.imageTag" -}}
{{- .Values.probe.image.tag | default .Chart.AppVersion }}
{{- end }}

{{/*
PostgreSQL service host when the bundled subchart is enabled, empty otherwise.
*/}}
{{- define "pulseguard.postgresql.host" -}}
{{- if .Values.postgresql.enabled }}{{ printf "%s-postgresql" (include "pulseguard.fullname" .) }}{{- end }}
{{- end }}

{{/*
Database connection string. An explicit secrets.databaseUrl wins; otherwise the
value is derived from the bundled PostgreSQL subchart (used for both
DATABASE_URL and DIRECT_URL).
*/}}
{{- define "pulseguard.databaseUrl" -}}
{{- if .Values.secrets.databaseUrl }}
{{- .Values.secrets.databaseUrl }}
{{- else if .Values.postgresql.enabled }}
{{- printf "postgresql://%s:%s@%s-postgresql:5432/%s" .Values.postgresql.auth.username .Values.postgresql.auth.password (include "pulseguard.fullname" .) .Values.postgresql.auth.database }}
{{- else }}
{{- "" }}
{{- end }}
{{- end }}
