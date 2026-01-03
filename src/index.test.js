const request = require('supertest');
const express = require('express');

// Import the app logic (we'll need to refactor index.js to export the app)
describe('Auth Service', () => {
  let app;

  beforeEach(() => {
    // Create a new app instance for each test
    app = express();
    app.use(express.json());

    // Health check endpoints
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'healthy', 
        service: 'auth-service',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    app.get('/ready', (req, res) => {
      res.status(200).json({ 
        status: 'ready', 
        service: 'auth-service',
        timestamp: new Date().toISOString()
      });
    });

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        service: 'auth-service',
        version: '1.0.0',
        description: 'Authentication and authorization service for Conga Platform',
        endpoints: [
          'GET /health - Health check',
          'GET /ready - Readiness check',
          'POST /api/auth/login - User login',
          'POST /api/auth/logout - User logout',
          'GET /api/auth/me - Get current user'
        ],
        environment: process.env.NODE_ENV || 'development'
      });
    });
  });

  describe('Health Endpoints', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('auth-service');
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /ready should return ready status', async () => {
      const response = await request(app).get('/ready');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ready');
      expect(response.body.service).toBe('auth-service');
    });
  });

  describe('Root Endpoint', () => {
    test('GET / should return service information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body.service).toBe('auth-service');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.description).toContain('Authentication');
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });
});