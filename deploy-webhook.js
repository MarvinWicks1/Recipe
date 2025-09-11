const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = 3001; // Different port from main app
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

app.use(express.json());

// GitHub webhook endpoint
app.post('/webhook/deploy', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature (security)
    const hash = crypto.createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
    
    const expectedSignature = `sha256=${hash}`;
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        console.log('❌ Invalid webhook signature');
        return res.status(401).send('Unauthorized');
    }
    
    // Only deploy on push to main branch
    if (req.body.ref !== 'refs/heads/main') {
        console.log('📝 Push to non-main branch, skipping deploy');
        return res.status(200).send('Skipped');
    }
    
    console.log('🚀 Deploying Recipe Keeper PWA...');
    
    // Run update script
    exec('./update.sh', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Deploy failed:', error);
            return res.status(500).send('Deploy failed');
        }
        
        console.log('✅ Deploy successful');
        console.log(stdout);
        
        res.status(200).send('Deploy successful');
    });
});

app.listen(PORT, () => {
    console.log(`🔗 Webhook server running on port ${PORT}`);
    console.log('📝 Set GitHub webhook URL to: http://your-server:3001/webhook/deploy');
});

module.exports = app;