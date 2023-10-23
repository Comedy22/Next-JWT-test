const request = require('supertest');
const app = require('../server');

describe('Dashboard Endpoint', () => {
  let authToken;

  beforeAll(async () => {
    const response = await request(app).post('/api/login').send({ username: 'Artem', password: '123' });
    authToken = response.body.token;
  });

  it('should return 401 without a valid token', async () => {
    await request(app)
      .get('/api/dashboard')
      .expect(401);
  });

  it('should return 200 and a welcome message with a valid token', async () => {
    await request(app)
      .get('/api/dashboard')
      .set('Cookie', `token=${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ success: true, message: 'Welcome to the dashboard, Artem!' });
      });
  });
});
