# Kirthi Diamonds — production image
# Multi-stage build: Vite client build + Express (tsx) runtime.
# Restored after the from-scratch repo push; matches the original build steps exactly.

FROM node:20.10-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20.10-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
RUN addgroup -g 1001 nodejs && adduser -S kirthi -u 1001 -G nodejs
COPY --from=builder --chown=kirthi:nodejs /app/dist ./dist
COPY --from=builder --chown=kirthi:nodejs /app/public ./public
COPY --from=builder --chown=kirthi:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=kirthi:nodejs /app/server.ts ./server.ts
COPY --from=builder --chown=kirthi:nodejs /app/package.json ./package.json
COPY --from=builder --chown=kirthi:nodejs /app/tsconfig.json ./tsconfig.json
USER kirthi
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/healthz || exit 1
CMD ["npx", "tsx", "server.ts"]
