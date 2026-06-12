# ==========================
# 1. Dependencies
# ==========================
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Allow postinstall scripts (sharp, unrs-resolver) to download native binaries
RUN pnpm install --frozen-lockfile --no-verify-store-integrity


# ==========================
# 2. Build
# ==========================
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# ==========================
# 3. Production Runner
# ==========================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Instruct node to run the standalone server
ENTRYPOINT ["node"]
CMD ["server.js"]

EXPOSE 3000
