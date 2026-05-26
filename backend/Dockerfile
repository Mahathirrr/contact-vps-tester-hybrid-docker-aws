# ============================================
# Backend Dockerfile - Contact Management API
# ============================================
FROM node:20-slim AS base

WORKDIR /app

# Install OpenSSL (required by Prisma) and curl (for healthcheck)
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (need prisma CLI for migrations)
RUN npm ci

# Copy prisma schema and migrations
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code and entrypoint
COPY src ./src/
COPY babel.config.json ./
COPY docker-entrypoint.sh ./

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ping || exit 1

# Use entrypoint script (handles migration + start)
ENTRYPOINT ["./docker-entrypoint.sh"]
