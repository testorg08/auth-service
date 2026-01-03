const request = require('supertest');
const createApp = require('./index');

describe('Auth Service', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('Health Endpoints', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('auth-service');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
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
      expect(response.body.message).toBe('Authentication Service');
      expect(response.body.version).toBeDefined();
      expect(response.body.environment).toBeDefined();
      expect(response.body.siteGroup).toBeDefined();
    });
  });

  describe('Auth Endpoints', () => {
    test('POST /auth/login should return login response', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'test', password: 'test' });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login endpoint');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    test('POST /auth/validate should validate token', async () => {
      const response = await request(app)
        .post('/auth/validate')
        .send({ token: 'demo-token' });
      
      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(true);
      expect(response.body.user).toBeDefined();
    });

    test('GET /auth/me should return user info', async () => {
      const response = await request(app).get('/auth/me');
      
      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(1);
      expect(response.body.user.username).toBe('demo-user');
      expect(Array.isArray(response.body.user.roles)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Endpoint not found');
    });
  });
});