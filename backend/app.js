const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('prom-client');
const bankRoutes = require('./routes/bank');
const users = require('./db/users');

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'app_http_request_duration_seconds',
  help: 'Duracion de las peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total de peticiones HTTP procesadas',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

app.use(cors({ origin: allowedOrigin }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  const stopTimer = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const route = req.route?.path || req.baseUrl || req.path;
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    stopTimer(labels);
    httpRequestsTotal.inc(labels);
  });

  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/bank', bankRoutes);

app.post('/login', (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contrasena son obligatorios' });
  }

  const user = users.find((item) => item.username === username && item.password === password);
  if (user) {
    return res.json({ success: true, username: user.username });
  }

  return res.status(401).json({ success: false, message: 'Usuario o contrasena incorrectos' });
});

app.post('/register', (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contrasena son obligatorios' });
  }

  const userExists = users.some((item) => item.username === username);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'El usuario ya existe' });
  }

  users.push({
    id: users.length + 1,
    username,
    password,
    accountNumber: `ACC-${String(users.length + 1).padStart(4, '0')}`,
    balance: 0,
  });

  return res.status(201).json({ success: true, username });
});

module.exports = app;
