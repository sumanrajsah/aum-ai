# --- base ---
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y git python3 build-essential curl \
 && rm -rf /var/lib/apt/lists/* \
 && corepack enable && corepack prepare yarn@stable --activate

# --- deps ---
FROM base AS deps
COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml ./
RUN yarn install --immutable

# --- build ---
FROM base AS build
COPY --from=deps /app /app
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn build

# --- run ---
FROM base AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3001 NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=deps /app ./
EXPOSE 3001
CMD ["yarn", "start", "-p", "3001"]
