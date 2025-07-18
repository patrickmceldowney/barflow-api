import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRouter from './api/index';
import prisma from './tools/prisma';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Extend Request interface to include db
declare global {
  namespace Express {
    interface Request {
      db?: any; // Will be replaced with Prisma client type
    }
  }
}

try {
  const environment = process.env.NODE_ENV || 'development';
  const databaseInfo = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.includes('railway')
      ? 'Railway PostgreSQL'
      : 'Local PostgreSQL'
    : 'No database configured';

  console.log(`🚀 Starting Barflow API...`);
  console.log(`🌍 Environment: ${environment}`);
  console.log(`🗄️  Database: ${databaseInfo}`);

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    })
  );

  // Logger middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Track if response has been sent
    let responseSent = false;

    // Override res.json to track responses and set response time header
    const originalJson = res.json;
    res.json = function (data) {
      if (responseSent) {
        console.error(
          `🚨 DOUBLE RESPONSE DETECTED on ${req.method} ${req.url}`
        );
        console.error(
          'First response was already sent, ignoring second response'
        );
        return res;
      }
      responseSent = true;
      const ms = Date.now() - start;
      res.setHeader('X-Response-Time', `${ms}ms`);
      console.log(`📤 Sending response for ${req.method} ${req.url}`);
      return originalJson.call(this, data);
    };

    // Override res.status to track responses
    const originalStatus = res.status;
    res.status = function (code) {
      if (responseSent) {
        console.error(
          `🚨 DOUBLE RESPONSE DETECTED on ${req.method} ${req.url}`
        );
        console.error(
          'First response was already sent, trying to set status again'
        );
        return res;
      }
      return originalStatus.call(this, code);
    };

    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(`${req.method} ${req.url} - ${ms}ms`);
    });
    next();
  });

  // Inject Prisma client into request object
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.db = prisma;
    next();
  });

  // Routes
  app.use('/api', apiRouter);

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Barflow API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: process.env.DATABASE_URL?.includes('railway')
        ? 'Railway PostgreSQL'
        : 'Local PostgreSQL',
      endpoints: {
        cocktails: '/api/cocktails',
        auth: '/api/auth',
        user: '/api/user',
        preferences: '/api/preferences',
        recommendations: '/api/recommendations',
        favorites: '/api/favorites',
      },
    });
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return res.status(500).json({
      error: 'Something went wrong!',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Internal server error',
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    return res.status(404).json({ error: 'Not found' });
  });

  app.listen(port, () => {
    console.log(`🚀 Barflow API listening on port ${port}...`);

    if (environment === 'development') {
      console.log(`📖 API Documentation: http://localhost:${port}`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
    } else {
      console.log(`🌍 Production environment - API is live!`);
      console.log(`🏥 Health Check: /health`);
    }
  });
} catch (error) {
  console.error(`Error starting application: `, error);
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  process.exit();
});
