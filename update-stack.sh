#!/bin/bash

# Recipe Keeper PWA Stack Update Script
echo "🔄 Updating Recipe Keeper PWA in Docker Stack..."

# Navigate to recipe-keeper directory within your stack
RECIPE_DIR="recipe-keeper"

if [ ! -d "$RECIPE_DIR" ]; then
    echo "❌ Recipe Keeper directory not found. Make sure you're in your docker stack root."
    exit 1
fi

cd $RECIPE_DIR

# Pull latest changes
echo "📥 Pulling latest code..."
git pull

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts manually."
    exit 1
fi

# Go back to stack root
cd ..

# Rebuild and deploy the Recipe Keeper container
echo "🐳 Rebuilding Recipe Keeper container..."
docker-compose build --no-cache recipe-keeper

echo "🔄 Deploying updated container..."
docker-compose up -d recipe-keeper

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

# Check status
echo "✅ Update complete! Checking status..."
docker-compose ps recipe-keeper
docker-compose logs --tail=10 recipe-keeper

echo ""
echo "🎉 Recipe Keeper PWA updated successfully!"
echo "📱 iPhone users will see update notification next time they open the app"
echo "🌐 Access at: https://recipes.vcuk.uk"
echo "🏠 Will appear on your Homepage dashboard automatically"