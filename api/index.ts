import express from 'express';
import cocktailRouter from './routes/cocktail';
import authRouter from './routes/auth';
import preferencesRouter from './routes/preferences';
import recommendationsRouter from './routes/recommendations';
import favoritesRouter from './routes/favorites';

const router = express.Router();

// Public routes
router.use('/cocktails', cocktailRouter);
router.use('/auth', authRouter);
router.use('/recommendations', recommendationsRouter);

// Protected routes (require authentication)
router.use('/preferences', preferencesRouter);
router.use('/favorites', favoritesRouter);

export default router;
