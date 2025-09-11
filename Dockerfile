# Recipe Keeper PWA - Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install curl and wget for health checks
RUN apk add --no-cache curl wget

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./
COPY --from=builder /app/healthcheck.js ./

# Create non-root user (matching your stack pattern)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S recipekeeper -u 1001 -G nodejs && \
    chown -R recipekeeper:nodejs /app

USER recipekeeper

EXPOSE 3000

# Health check (matching your other services)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "server.js"]