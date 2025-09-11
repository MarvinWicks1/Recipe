#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Farmhouse Recipe Keeper PWA...');

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ Created public directory');
}

// Update service worker cache version for cache busting
const swPath = path.join(publicDir, 'sw.js');
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const newCacheName = `farmhouse-recipe-keeper-v${timestamp}`;
  
  swContent = swContent.replace(
    /const CACHE_NAME = '[^']+';/,
    `const CACHE_NAME = '${newCacheName}';`
  );
  
  fs.writeFileSync(swPath, swContent);
  console.log('✅ Updated service worker cache version');
}

// Validate manifest.json
const manifestPath = path.join(publicDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('✅ Manifest.json is valid');
    console.log(`   App name: ${manifest.name}`);
    console.log(`   Icons: ${manifest.icons.length} defined`);
  } catch (error) {
    console.error('❌ Invalid manifest.json:', error.message);
    process.exit(1);
  }
}

// Check for required files
const requiredFiles = [
  'index.html',
  'manifest.json',
  'sw.js',
  'icon-192.png',
  'icon-512.png'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('❌ Build failed: Missing required files');
  process.exit(1);
}

// Create .htaccess for Apache servers (if needed)
const htaccessContent = `# PWA Support
<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest .json
  AddType text/cache-manifest .appcache
</IfModule>

# Service Worker
<Files "sw.js">
  Header set Service-Worker-Allowed "/"
  Header set Cache-Control "no-cache"
</Files>

# Manifest
<Files "manifest.json">
  Header set Cache-Control "no-cache"
</Files>

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Cache Control
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Fallback for SPA routing
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]
`;

fs.writeFileSync(path.join(publicDir, '.htaccess'), htaccessContent);
console.log('✅ Created .htaccess file for Apache');

// Create nginx.conf template
const nginxConfig = `# Nginx configuration for Farmhouse Recipe Keeper PWA
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/farmhouse-recipe-keeper/public;
    index index.html;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        add_header Service-Worker-Allowed "/";
    }

    # Manifest
    location /manifest.json {
        add_header Cache-Control "no-cache";
    }

    # Static assets
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes (if using Node.js backend)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
`;

fs.writeFileSync(path.join(__dirname, 'nginx.conf.example'), nginxConfig);
console.log('✅ Created nginx configuration example');

console.log('🎉 Build completed successfully!');
console.log('');
console.log('📁 Project structure:');
console.log('├── public/           # Static files served by Express');
console.log('├── server.js         # Express server');
console.log('├── package.json      # Dependencies and scripts');
console.log('├── build.js          # This build script');
console.log('└── nginx.conf.example # Nginx config template');
console.log('');
console.log('🚀 Ready to deploy!');
console.log('   npm start          # Start production server');
console.log('   npm run dev        # Start development server with auto-reload');