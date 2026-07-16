# Build stage using Bun (multi-stage build from workspace root)
# Build command: docker build -f apps/probe/Dockerfile -t pulseguard-probe .
FROM oven/bun:1.2-alpine AS build
WORKDIR /app

COPY package.json bun.lock tsconfig.json turbo.json ./
COPY packages/ ./packages/
COPY apps/probe/ ./apps/probe/

RUN bun install --frozen-lockfile
RUN bun run --cwd apps/probe build

# Minimal runtime stage with no source code or node_modules
FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/apps/probe/dist/index.js ./index.js
ENV NODE_ENV=production
CMD ["node", "index.js"]
