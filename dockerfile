# syntax=docker/dockerfile:1.7

# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# ---- Deps (for build) ----
FROM base AS deps
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN apk add --no-cache dumb-init

# Copy standalone output only (includes its own minimal node_modules)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Non-root user
RUN addgroup -S next && adduser -S next -G next
USER next

EXPOSE 3000
# Use a route that exists; change if you have /health
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["dumb-init","--"]
CMD ["node","server.js"]
