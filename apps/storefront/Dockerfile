# ── Manada Safety storefront (Next.js) — production image ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time env (baked into the client bundle)
ARG NEXT_PUBLIC_BASE_URL=https://manada.mn
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
# robots.txt is prerendered at build time — pass the flag here too
ARG ALLOW_INDEXING=false
ENV ALLOW_INDEXING=$ALLOW_INDEXING
# API is reached server-side through the docker network
ENV ODOO_INTERNAL_URL=http://odoo:8069
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
