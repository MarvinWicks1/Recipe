// PM2 ecosystem configuration for production deployment
module.exports = {
  apps: [{
    name: 'farmhouse-recipe-keeper',
    script: 'server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    // Restart settings
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log'],
    max_restarts: 10,
    min_uptime: '10s',
    
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced settings
    kill_timeout: 5000,
    listen_timeout: 10000,
    shutdown_with_message: true,
    
    // Memory management
    max_memory_restart: '500M',
    
    // Health monitoring
    health_check_http: {
      endpoint: '/api/health',
      interval: 30000,
      timeout: 5000
    }
  }],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/farmhouse-recipe-keeper.git',
      path: '/var/www/farmhouse-recipe-keeper',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
};