# PulseGuard Helm Chart

Helm chart for self-hosting the [PulseGuard](https://github.com/alexgutscher26/pulseguard) web dashboard on Kubernetes.

## Prerequisites

- Kubernetes 1.25+
- [Helm](https://helm.sh/) 3.14+
- The PulseGuard web image `ghcr.io/alexgutscher26/pulseguard-web` (pushed on every release)
- An external PulseGuard Worker (Cloudflare) and the matching `probeSecret` — the web dashboard and probe communicate through it

## Install

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm dependency build helm/pulseguard

helm install pulseguard helm/pulseguard \
  --namespace pulseguard --create-namespace \
  --set secrets.betterAuthSecret=$(openssl rand -base64 48) \
  --set secrets.betterAuthUrl=https://pulseguard.yourdomain.com \
  --set secrets.nextPublicAppUrl=https://pulseguard.yourdomain.com \
  --set secrets.corsOrigin=https://pulseguard.yourdomain.com \
  --set secrets.probeSecret=$(openssl rand -hex 32) \
  --set ingress.hosts[0].host=pulseguard.yourdomain.com \
  --set ingress.tls[0].hosts[0]=pulseguard.yourdomain.com \
  --set ingress.tls[0].secretName=pulseguard-tls \
  --set postgresql.auth.password=$(openssl rand -base64 24)
```

After install, run the database migrations (see the `helm install` output) and `helm test pulseguard -n pulseguard`.

## Configuration

The chart bundles a PostgreSQL subchart (Bitnami). When `secrets.databaseUrl` / `secrets.directUrl` are empty and `postgresql.enabled` is true, the connection strings are derived automatically from the subchart values.

### Key values

| Value                                    | Description                                              | Default                                 |
| ---------------------------------------- | -------------------------------------------------------- | --------------------------------------- |
| `web.enabled`                            | Deploy the web dashboard                                 | `true`                                  |
| `web.replicaCount`                       | Web replicas                                             | `2`                                     |
| `web.image.repository` / `web.image.tag` | Web image; tag defaults to `appVersion`                  | `ghcr.io/alexgutscher26/pulseguard-web` |
| `web.autoscaling.enabled`                | Enable HPA                                               | `false`                                 |
| `probe.enabled`                          | Deploy a private probe pointing at your Worker           | `false`                                 |
| `probe.config.apiUrl`                    | Worker URL the probe reports to                          | `https://worker.yourdomain.com`         |
| `ingress.enabled`                        | Create an Ingress                                        | `true`                                  |
| `secrets.*`                              | Application secrets (see below)                          | —                                       |
| `postgresql.enabled`                     | Bundle the Bitnami PostgreSQL subchart                   | `true`                                  |
| `externalDatabase.*`                     | External DB connection (when `postgresql.enabled=false`) | —                                       |
| `metrics.serviceMonitor.enabled`         | Create a ServiceMonitor for Prometheus Operator          | `false`                                 |
| `networkPolicy.enabled`                  | Default-deny network policy for the web pods             | `false`                                 |

### Required secrets

- `secrets.betterAuthSecret` — at least 32 random characters
- `secrets.betterAuthUrl`, `secrets.nextPublicAppUrl`, `secrets.corsOrigin` — the public URL
- `secrets.databaseUrl` / `secrets.directUrl` — only when using an external database

Optional: `resendApiKey` (email), `openaiApiKey`, `upstashRedisRestUrl` + `upstashRedisRestToken`, `slackClient*`, `googleClient*`, `probeSecret`.

Use a secret manager (ExternalSecrets, Sealed Secrets, Vault) in production instead of committing values.

### External database

```bash
helm install pulseguard helm/pulseguard \
  --set postgresql.enabled=false \
  --set secrets.databaseUrl=postgresql://user:pass@db.example.com:5432/pulseguard \
  --set secrets.directUrl=postgresql://user:pass@db.example.com:5432/pulseguard
```

### Private probe

```bash
helm install pulseguard helm/pulseguard \
  --set probe.enabled=true \
  --set probe.config.apiUrl=https://worker.yourdomain.com \
  --set secrets.probeSecret=<token shared with your Worker>
```

## Migrations

The web image is a trimmed Next.js standalone build and does not ship the Prisma CLI. Run migrations from a machine with the repository checked out:

```bash
export DATABASE_URL="postgresql://<user>:<pass>@<host>:5432/<db>"
bunx prisma migrate deploy --schema packages/db/prisma/schema/schema.prisma
```

## Upgrade

```bash
helm repo update
helm dependency update helm/pulseguard
helm upgrade pulseguard helm/pulseguard --namespace pulseguard
```

The web deployment rolls automatically when the secret content changes (via a `checksum/secret` annotation).

## Uninstall

```bash
helm uninstall pulseguard --namespace pulseguard
```

> Note: PVCs for the bundled PostgreSQL are not deleted by default. Remove them with `kubectl delete pvc` if you intend to destroy the data.
