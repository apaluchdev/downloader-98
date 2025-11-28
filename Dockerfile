# Multi-stage build: build static assets with Vite, serve with Nginx

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Copy source
COPY . .

# Build for production
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine AS runtime

# Create a mount point for persistent storage
# (Your container runtime can bind mount a host path here)
RUN mkdir -p /data
VOLUME ["/data"]

# Copy built assets to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom default index could read/write /data via client-side JS APIs
# Expose port 80
EXPOSE 80

# Nginx will default to serving /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
