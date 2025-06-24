const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const connectDatabase = require('./config/database');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'mexvisa-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Additional CORS preflight handler
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', true);
  res.sendStatus(200);
});


app.get('/', (req, res) => {
  res.json({ 
    message: 'Visa-Mex Backend Server is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});


app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Visa-Mex API Test Route is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


try {
  const testRoutes = require('./routes/testRoutes');
  app.use('/api/test-extended', testRoutes);
  console.log('✅ Test routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading test routes:', error.message);
}

try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
  console.log('📍 Available auth endpoints:');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   POST /api/auth/verify-email');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  console.error('❌ Full error:', error);
}


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});


connectDatabase();


const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔄 CORS enabled for frontend: http://localhost:5173`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`✅ Server is running on port ${newPort}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Server URL: http://localhost:${newPort}`);
      console.log(`⚠️  Remember to update your frontend API URL to: http://localhost:${newPort}`);
    });
  } else {
    console.error('❌ Server error:', err);
  }
}); 