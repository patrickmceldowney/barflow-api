'';

import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
const userRouter = express.Router();

// Note: Request.user type is already defined in main.ts

// Middleware to extract user from JWT token
const authenticateUser = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    );

    const user = await req.db.user.findUnique({
      where: { id: decoded.userId },
      include: { preferences: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user profile
userRouter.get(
  '/profile',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user as any;

      return res.json({
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update user profile
userRouter.put(
  '/profile',
  [
    authenticateUser,
    body('username')
      .optional()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Check if username or email already exists
      if (username) {
        const existingUser = await req.db.user.findFirst({
          where: {
            username,
            NOT: { id: userId },
          },
        });
        if (existingUser) {
          return res.status(409).json({ error: 'Username already taken' });
        }
      }

      if (email) {
        const existingUser = await req.db.user.findFirst({
          where: {
            email,
            NOT: { id: userId },
          },
        });
        if (existingUser) {
          return res.status(409).json({ error: 'Email already registered' });
        }
      }

      // Update user
      const updatedUser = await req.db.user.update({
        where: { id: userId },
        data: {
          ...(username && { username }),
          ...(email && { email }),
          updatedAt: new Date(),
        },
        include: { preferences: true },
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return res.json({
        message: 'Profile updated successfully',
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Change password
userRouter.put(
  '/password',
  [
    authenticateUser,
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Get user with current password
      const userWithPassword = await req.db.user.findUnique({
        where: { id: userId },
      });

      if (!userWithPassword) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        userWithPassword.password
      );
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await req.db.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      });

      return res.json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Delete account
userRouter.delete(
  '/account',
  [
    authenticateUser,
    body('password')
      .notEmpty()
      .withMessage('Password is required for account deletion'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { password } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Get user with current password
      const userWithPassword = await req.db.user.findUnique({
        where: { id: userId },
      });

      if (!userWithPassword) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        userWithPassword.password
      );
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Password is incorrect' });
      }

      // Delete user (this will cascade delete preferences and favorites)
      await req.db.user.delete({
        where: { id: userId },
      });

      return res.json({
        message: 'Account deleted successfully',
      });
    } catch (error) {
      console.error('Delete account error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get user statistics
userRouter.get(
  '/stats',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Get user's favorite count
      const favoriteCount = await req.db.userFavorite.count({
        where: { userId },
      });

      // Get user's preferences
      const preferences = await req.db.userPreferences.findUnique({
        where: { userId },
      });

      // Get recent favorites (last 5)
      const recentFavorites = await req.db.userFavorite.findMany({
        where: { userId },
        include: {
          cocktail: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              difficulty: true,
            },
          },
        },
        orderBy: { addedAt: 'desc' },
        take: 5,
      });

      return res.json({
        stats: {
          totalFavorites: favoriteCount,
          preferences: preferences
            ? {
                favoriteFlavors: preferences.favoriteFlavors,
                favoriteIngredients: preferences.favoriteIngredients,
                dietaryRestrictions: preferences.dietaryRestrictions,
                alcoholPreference: preferences.alcoholPreference,
                skillLevel: preferences.skillLevel,
                preferredGlassware: preferences.preferredGlassware,
              }
            : null,
          recentFavorites: recentFavorites.map((fav: any) => fav.cocktail),
        },
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default userRouter;
