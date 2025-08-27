# --- deps ---
FROM node:22-bookworm-slim AS deps
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci --include=dev

# --- build ---
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- run (slim, no dev deps) ---
FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000 NEXT_TELEMETRY_DISABLED=1
# only install prod deps
COPY package*.json ./
RUN npm ci --omit=dev
# copy build output and needed files
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.* ./    # if exists
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./    # keep scripts
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://localhost:3000').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npm","run","start","--","-p","3000"]
