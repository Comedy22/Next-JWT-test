const request = require('supertest');
const app = require('../server');

describe('Login Endpoint', () => {
  it('should return 401 for incorrect credentials', async () => {
    await request(app)
      .post('/api/login')
      .send({ username: 'invaliduser', password: 'wrongpassword' })
      .expect(401);
  });

  it('should return 200 and a token for correct credentials', async () => {
    await request(app)
      .post('/api/login')
      .send({ username: 'Artem', password: '123' })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('token');
      });
  });
});
