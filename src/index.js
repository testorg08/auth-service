const express = require('express');

function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());

  // Health check endpoints
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      service: 'auth-service',
      version: process.env.VERSION || 'dev',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  app.get('/ready', (req, res) => {
    res.json({ 
      status: 'ready', 
      service: 'auth-service',
      version: process.env.VERSION || 'dev'
    });
  });

  // Main endpoint
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Authentication Service', 
      version: process.env.VERSION || 'dev',
      environment: process.env.NODE_ENV || 'development',
      siteGroup: process.env.SITE_GROUP || 'SSG1'
    });
  });

  // Auth endpoints (demo)
  app.post('/auth/login', (req, res) => {
    res.json({ 
      message: 'Login endpoint', 
      token: 'demo-jwt-token',
      user: { id: 1, username: 'demo-user' }
    });
  });

  app.post('/auth/validate', (req, res) => {
    res.json({ 
      valid: true, 
      user: { id: 1, username: 'demo-user' }
    });
  });

  app.get('/auth/me', (req, res) => {
    res.json({ 
      user: { 
        id: 1, 
        username: 'demo-user', 
        roles: ['user'] 
      }
    });
  });

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  return app;
}

// Export the app for testing
module.exports = createApp;

// Start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();
  
  app.listen(PORT, () => {
    console.log(`Auth service listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Site Group: ${process.env.SITE_GROUP || 'SSG1'}`);
  });
}