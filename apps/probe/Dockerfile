# Build stage using Bun (multi-stage build from workspace root)
# Build command: docker build -f apps/probe/Dockerfile -t steadystack-probe .
FROM oven/bun:1.2-alpine AS build
WORKDIR /app

COPY package.json bun.lock tsconfig.json turbo.json ./
COPY packages/ ./packages/
COPY apps/probe/ ./apps/probe/

RUN bun install --frozen-lockfile
RUN bun run --cwd apps/probe build

# Minimal runtime stage with no source code or node_modules
FROM node:22-alpine AS runtime

# Create a dedicated non-root user/group for least-privilege execution
RUN addgroup --system --gid 1001 probe \
    && adduser --system --uid 1001 --ingroup probe --no-create-home probe

WORKDIR /app
COPY --from=build /app/apps/probe/dist/index.js ./index.js

# Transfer ownership so the non-root user can read the entrypoint
RUN chown probe:probe /app/index.js

ENV NODE_ENV=production

# Drop root privileges before the process starts
USER probe

CMD ["node", "index.js"]
