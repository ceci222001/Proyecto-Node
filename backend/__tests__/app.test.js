const request = require('supertest');
const app = require('../app');

describe('Backend API', () => {
  test('GET /health responde ok', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'backend' });
  });

  test('POST /login autentica un usuario valido', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'sara', password: '12345' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ success: true, username: 'sara' });
  });

  test('POST /login rechaza credenciales invalidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'sara', password: 'bad-password' });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('POST /register crea usuario nuevo', async () => {
    const username = `qa-user-${Date.now()}`;
    const response = await request(app)
      .post('/register')
      .send({ username, password: 'test123' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ success: true, username });
  });

  test('GET /bank/bank-details devuelve datos cuando llega usuario', async () => {
    const response = await request(app)
      .get('/bank/bank-details')
      .query({ username: 'sara' });

    expect(response.statusCode).toBe(200);
    expect(response.body.accountDetails).toMatchObject({
      username: 'sara',
      accountNumber: '1155222',
      balance: 1000,
    });
  });
});
