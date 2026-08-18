const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

/* ========================================================================
   TRUST RENDER PROXY
   ======================================================================== */

/*
 * Render runs the Express backend behind a reverse proxy.
 *
 * This allows Express and express-rate-limit to correctly read
 * the client's IP address from X-Forwarded-For.
 */
app.set('trust proxy', 1);


/* ========================================================================
   GLOBAL MIDDLEWARE
   ======================================================================== */

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);


/* ========================================================================
   RATE LIMITING
   ======================================================================== */

/*
 * Protect API routes from excessive requests.
 *
 * Maximum:
 * 100 requests per IP every 15 minutes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    message: 'Too many requests, please try again later.',
  },
});

app.use('/api', apiLimiter);


/* ========================================================================
   HEALTH CHECK
   ======================================================================== */

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});


/* ========================================================================
   ROUTES
   ======================================================================== */

/* Authentication */
app.use('/api/auth', authRoutes);

/* Administrator */
app.use('/api/admin', adminRoutes);

/* Stores */
app.use('/api/stores', storeRoutes);

/* Store Owner */
app.use('/api/owner', ownerRoutes);


/* ========================================================================
   404 - ROUTE NOT FOUND
   ======================================================================== */

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});


/* ========================================================================
   GLOBAL ERROR HANDLER
   ======================================================================== */

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    message: 'Internal server error',
  });
});


/* ========================================================================
   SERVER
   ======================================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
