# --------------------------------------
# Base
# --------------------------------------
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# --------------------------------------
# Prune
# --------------------------------------
FROM base AS pruner
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo prune site api --docker

# --------------------------------------
# Install
# --------------------------------------
FROM base AS installer
WORKDIR /app

COPY --from=pruner /repo/out/json/ .
COPY --from=pruner /repo/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

# --------------------------------------
# Build
# --------------------------------------
FROM installer AS builder
COPY --from=pruner /repo/out/full/ .
RUN pnpm turbo run build --filter=site... --filter=api...

# --------------------------------------
# Runtime
# --------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
ENV NODE_ENV=production

# tini handles signals correctly
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

COPY --from=builder /app ./

EXPOSE 3000 5173

CMD ["sh", "-c", "pnpm --filter api start & pnpm --filter site start"]