# Build stage using Bun (multi-stage build from workspace root)
# Build command: docker build -f apps/web/Dockerfile -t pulseguard-web .
FROM oven/bun:1.2-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_WORKER_URL=http://localhost:8787
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_WORKER_URL=$NEXT_PUBLIC_WORKER_URL

COPY package.json bun.lock tsconfig.json turbo.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN bun install --frozen-lockfile
RUN bun run --cwd apps/web next build

# Minimal runtime stage with only the Next.js standalone output
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
