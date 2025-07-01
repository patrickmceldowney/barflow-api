"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_1 = __importDefault(require("./api/index"));
const prisma_1 = __importDefault(require("./tools/prisma"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
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
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    }));
    app.use((req, res, next) => {
        const start = Date.now();
        let responseSent = false;
        const originalJson = res.json;
        res.json = function (data) {
            if (responseSent) {
                console.error(`🚨 DOUBLE RESPONSE DETECTED on ${req.method} ${req.url}`);
                console.error('First response was already sent, ignoring second response');
                return res;
            }
            responseSent = true;
            const ms = Date.now() - start;
            res.setHeader('X-Response-Time', `${ms}ms`);
            console.log(`📤 Sending response for ${req.method} ${req.url}`);
            return originalJson.call(this, data);
        };
        const originalStatus = res.status;
        res.status = function (code) {
            if (responseSent) {
                console.error(`🚨 DOUBLE RESPONSE DETECTED on ${req.method} ${req.url}`);
                console.error('First response was already sent, trying to set status again');
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
    app.use((req, res, next) => {
        req.db = prisma_1.default;
        next();
    });
    app.use('/api', index_1.default);
    app.get('/', (req, res) => {
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
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    app.use((err, req, res, next) => {
        console.error(err.stack);
        return res.status(500).json({
            error: 'Something went wrong!',
            message: process.env.NODE_ENV === 'development'
                ? err.message
                : 'Internal server error',
        });
    });
    app.use((req, res) => {
        return res.status(404).json({ error: 'Not found' });
    });
    app.listen(port, () => {
        console.log(`🚀 Barflow API listening on port ${port}...`);
        if (environment === 'development') {
            console.log(`📖 API Documentation: http://localhost:${port}`);
            console.log(`🏥 Health Check: http://localhost:${port}/health`);
        }
        else {
            console.log(`🌍 Production environment - API is live!`);
            console.log(`🏥 Health Check: /health`);
        }
    });
}
catch (error) {
    console.error(`Error starting application: `, error);
}
process.on('SIGINT', () => {
    console.log('Gracefully shutting down...');
    process.exit();
});
//# sourceMappingURL=main.js.map