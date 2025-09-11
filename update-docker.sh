#!/bin/bash

# Recipe Keeper PWA Docker Update Script
echo "🔄 Updating Recipe Keeper PWA (Docker)..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts manually."
    exit 1
fi

# Build and deploy with Docker
echo "🐳 Building new Docker image..."
docker-compose -f docker-compose.traefik.yml build --no-cache

echo "🔄 Deploying updated container..."
docker-compose -f docker-compose.traefik.yml up -d

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

# Check status
echo "✅ Update complete! Checking status..."
docker-compose -f docker-compose.traefik.yml ps
docker-compose -f docker-compose.traefik.yml logs --tail=10 recipe-keeper

echo ""
echo "🎉 Recipe Keeper PWA updated successfully!"
echo "📱 iPhone users will see update notification next time they open the app"
echo "🌐 Access at: https://recipes.yourdomain.com"
echo "🐳 Container status: $(docker ps --filter name=recipe-keeper --format 'table {{.Status}}')"