# 🏡 Farmhouse Recipe Keeper PWA

A beautiful, rustic Progressive Web App for storing and organizing your favorite recipes. Built with a calm, farmhouse kitchen aesthetic that makes recipe management feel like browsing through grandmother's recipe collection.

## ✨ Features

- **📱 Progressive Web App**: Install on any device, works offline
- **🎨 Farmhouse Aesthetic**: Warm colors, elegant typography, rustic design
- **📝 Smart Recipe Import**: Paste any recipe text, automatically organized
- **🔍 Search & Filter**: Find recipes instantly
- **💾 Local Storage**: All recipes stored securely in your browser
- **📱 Mobile-First**: Responsive design for all devices
- **🔄 Offline Support**: Full functionality without internet

## 🚀 Quick Start

### For Development

```bash
# Clone or download the project
cd farmhouse-recipe-keeper

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Open your browser to http://localhost:3000
```

### For Production (Headless Server)

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for production management
npm install -g pm2
npm run pm2:start
```

## 📁 Project Structure

```
farmhouse-recipe-keeper/
├── public/                 # Static files served by Express
│   ├── index.html         # Main PWA application
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker for offline support
│   ├── icon-*.png        # App icons
│   └── favicon-*.png     # Favicons
├── server.js             # Express server
├── package.json          # Dependencies and scripts
├── build.js             # Build script
├── ecosystem.config.js  # PM2 configuration
└── README.md           # This file
```

## 🖥️ Server Deployment

### Using Node.js + Express (Recommended)

The app includes a production-ready Express server:

```bash
# Set environment variables
export NODE_ENV=production
export PORT=3000
export HOST=0.0.0.0

# Start server
npm start
```

### Using PM2 (Production Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
npm run pm2:start

# Monitor
npm run pm2:logs

# Restart
npm run pm2:restart

# Stop
npm run pm2:stop
```

### Using Nginx (Static Files Only)

If you prefer serving static files with Nginx:

```bash
# Copy public folder to your web root
cp -r public/* /var/www/html/

# Use the provided nginx.conf.example
sudo cp nginx.conf.example /etc/nginx/sites-available/recipe-keeper
sudo ln -s /etc/nginx/sites-available/recipe-keeper /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Using Apache

The build process creates a `.htaccess` file in the public directory for Apache servers.

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0 for headless servers)

### PWA Configuration

Edit `public/manifest.json` to customize:
- App name and description
- Theme colors
- Icons
- Start URL

## 📱 PWA Installation

### Desktop
1. Open the app in Chrome, Edge, or Safari
2. Click the "📱 Install App" button
3. Follow the installation prompts

### Mobile
1. Open in mobile browser
2. Add to home screen
3. App opens in full-screen mode

## 🔄 Offline Support

The service worker caches all app resources for offline use:
- App works completely offline after first visit
- Recipes stored locally in browser
- Automatic updates when online

## 🎨 Customization

### Colors
Edit CSS variables in `public/index.html`:
```css
:root {
    --cream: #faf7f2;
    --sage: #9caf88;
    --terracotta: #c17b5c;
    /* ... more colors */
}
```

### Fonts
The app uses Google Fonts (Crimson Text & Libre Baskerville). Change in the HTML head section.

## 🔒 Security

The Express server includes security best practices:
- Helmet.js for security headers
- CORS protection
- Content Security Policy
- Input validation
- Rate limiting ready

## 📊 Monitoring

### Health Check
- Endpoint: `GET /api/health`
- Returns server status and uptime

### PM2 Monitoring
```bash
pm2 monit                    # Real-time monitoring
pm2 logs farmhouse-recipe-keeper  # View logs
pm2 restart farmhouse-recipe-keeper # Restart app
```

## 🚀 Deployment Options

### 1. VPS/Cloud Server
```bash
# On your server
git clone https://github.com/yourusername/farmhouse-recipe-keeper.git
cd farmhouse-recipe-keeper
npm install
npm run build
npm start
```

### 2. Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Reverse Proxy Setup
```nginx
# Nginx reverse proxy to Node.js
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## 📝 Usage

### Adding Recipes
1. Click "Add Recipe" tab
2. Enter a title
3. Paste recipe content from any source
4. App automatically organizes ingredients and instructions

### Managing Recipes
- **View**: Click any recipe card
- **Edit**: Click edit button or use "Add Recipe" tab
- **Delete**: Click delete button (with confirmation)
- **Search**: Use search bar to find recipes

### PWA Features
- **Install**: Click install button when available
- **Offline**: Works without internet after installation
- **Updates**: Automatic update notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🐛 Troubleshooting

### Common Issues

**Service Worker not registering:**
- Ensure HTTPS or localhost
- Check browser console for errors

**PWA not installable:**
- Verify manifest.json is valid
- Ensure all required icons exist
- Check HTTPS requirement

**Server won't start:**
- Check if port is available: `lsof -i :3000`
- Verify Node.js version: `node --version` (requires 16+)
- Check logs: `npm run pm2:logs`

### Support

- Check the [Issues](https://github.com/yourusername/farmhouse-recipe-keeper/issues) page
- Create a new issue with detailed description
- Include browser/server information

---

Made with ❤️ for home cooks who love beautiful, organized recipes. 🥧👩‍🍳