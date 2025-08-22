// A simple, unified backend server for an API key site
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory store for API keys (use a database for production)
const apiKeys = new Set();

// A basic root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Hello from your API server!');
});

// Endpoint to generate a new API key
app.post('/generate-key', (req, res) => {
  const key = crypto.randomBytes(24).toString('hex');
  apiKeys.add(key);
  res.json({ apiKey: key });
});

// Middleware to check API key
function checkApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || !apiKeys.has(key)) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

// Example protected endpoint
app.get('/data', checkApiKey, (req, res) => {
  res.json({ message: 'This is protected data.' });
});

app.listen(port, () => {
  // The 'port' variable will be provided by the hosting service
  console.log(`API server running on port ${port}`);
});