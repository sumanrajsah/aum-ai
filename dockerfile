# syntax=docker/dockerfile:1.7

# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Deps (prod) ----
FROM base AS deps
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
# set any build-time envs as needed:
# ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Install dumb-init for proper signal handling (alpine doesn't have it by default)
RUN apk add --no-cache dumb-init

# public assets + standalone server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# if your standalone needs native deps, include prod node_modules:
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:3000/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node","server.js"]