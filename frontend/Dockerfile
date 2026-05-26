# ============================================
# Frontend Dockerfile - Contact Management Vue
# Multi-stage build: Build with Node, Serve with Nginx
# ============================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build arguments (will be baked into the frontend build)
ARG VITE_API_PATH=/api/
ARG VITE_OTEL_ENDPOINT=http://localhost:4318/v1/traces
ENV VITE_API_PATH=$VITE_API_PATH
ENV VITE_OTEL_ENDPOINT=$VITE_OTEL_ENDPOINT

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
