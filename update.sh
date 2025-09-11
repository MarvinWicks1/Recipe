#!/bin/bash

# Recipe Keeper PWA Update Script
echo "🔄 Updating Recipe Keeper PWA..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts manually."
    exit 1
fi

# Install any new dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application (updates service worker cache)
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting server..."
npm run pm2:restart

# Check status
echo "✅ Update complete! Checking status..."
npm run pm2:logs --lines 5

echo ""
echo "🎉 Recipe Keeper PWA updated successfully!"
echo "📱 iPhone users will see update notification next time they open the app"
echo "🌐 Access at: http://$(hostname -I | awk '{print $1}'):3000"