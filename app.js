const express = require('express');
const client = require('prom-client');

const app = express();
const register = client.Registry.globalRegistry;
client.collectDefaultMetrics({ register });

// Custom counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

app.get('/', (req, res) => {
  httpRequestCounter.inc({ method: 'GET', route: '/', status: 200 });
  res.json({ message: 'Hello from Node.js CI/CD App!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = app;