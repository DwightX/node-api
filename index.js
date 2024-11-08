const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require("restify-jwt-community");
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({
  name: 'MyApp',
  version: '1.0.0'
});

// CORS middleware
const cors = corsMiddleware({
  origins: process.env.NODE_ENV === 'production' ? ['https://blogger-dc.netlify.app/'] : ['http://localhost:8080'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization'],
  credentials: true,
});
server.pre(cors.preflight);
server.use(cors.actual);

// Middleware
server.use(restify.plugins.bodyParser());

// Protect routes
server.use(
  rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth', '/health'] }) // Allow access to auth and health check routes
);

// Health check route
server.get('/health', (req, res, next) => {
  res.send(200, { status: 'OK' });
  next();
});

// Start server
server.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);

  // Connect to MongoDB
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
});

// MongoDB connection events
const db = mongoose.connection;
db.on('error', err => console.error('MongoDB connection error:', err));
db.once('open', () => {
  console.log('Connected to MongoDB');
  require('./routes/customers')(server);
  require('./routes/users')(server);
  require('./routes/post')(server);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
