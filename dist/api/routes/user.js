"use strict";
'';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const userRouter = express_1.default.Router();
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = await req.db.user.findUnique({
            where: { id: decoded.userId },
            include: { preferences: true },
        });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
userRouter.get('/profile', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const { password, ...userWithoutPassword } = user;
        return res.json({
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
userRouter.put('/profile', [
    authenticateUser,
    (0, express_validator_1.body)('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email format'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const userId = user.id;
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
userRouter.put('/password', [
    authenticateUser,
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { currentPassword, newPassword } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const userId = user.id;
        const userWithPassword = await req.db.user.findUnique({
            where: { id: userId },
        });
        if (!userWithPassword) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, userWithPassword.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
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
    }
    catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
userRouter.delete('/account', [
    authenticateUser,
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required for account deletion'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { password } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const userId = user.id;
        const userWithPassword = await req.db.user.findUnique({
            where: { id: userId },
        });
        if (!userWithPassword) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, userWithPassword.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Password is incorrect' });
        }
        await req.db.user.delete({
            where: { id: userId },
        });
        return res.json({
            message: 'Account deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete account error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
userRouter.get('/stats', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const userId = user.id;
        const favoriteCount = await req.db.userFavorite.count({
            where: { userId },
        });
        const preferences = await req.db.userPreferences.findUnique({
            where: { userId },
        });
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
                recentFavorites: recentFavorites.map((fav) => fav.cocktail),
            },
        });
    }
    catch (error) {
        console.error('Get stats error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = userRouter;
//# sourceMappingURL=user.js.map