FROM node:20-alpine AS deps
WORKDIR /app
# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Use a default ARG for API URL at build time so the server component knows where to fetch
ARG API_URL=http://backend:8080
ENV API_URL=$API_URL
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
# Allow client to reach localhost API if needed, or routed through reverse proxy
# But since server fetches it, it will use API_URL
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
