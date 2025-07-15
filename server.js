const express = require('express');
const connectDB = require('./src/config/db');
const OrganizationRouter = require('./src/routes/Organization');
const PackagesRouter = require('./src/routes/Organization');
const authRouter = require('./src/routes/auth');
const RegisterProduct = require('./src/routes/ProductRoute');
const cors = require('cors');
const path = require('path');

const startServer = async () => {
  const app = express();

  // 1. CORS Middleware - MUST come first
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // 2. Body Parsing Middleware
  app.use(express.json());

  // 3. Database Connection
  await connectDB();

  app.use('/public', express.static(path.join(__dirname, 'public')));

  // 4. Routes
  app.use('/registerorganization', OrganizationRouter);
  app.use('/registerpackage', PackagesRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/product', RegisterProduct);

  // 5. Health Check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Server failed to start:', err);
  process.exit(1);
});