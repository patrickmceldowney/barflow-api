import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

// Register new user
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // TODO: Validate input with Joi or express-validator
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: 'Email, password, and username are required' });
    }

    // TODO: Check if user already exists with Prisma
    // const existingUser = await prisma.user.findUnique({ where: { email } });
    // if (existingUser) {
    //   return res.status(409).json({ error: 'User already exists' });
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // TODO: Create user with Prisma
    // const user = await prisma.user.create({
    //   data: {
    //     email,
    //     username,
    //     password: hashedPassword,
    //   },
    // });

    // Generate JWT token
    const token = jwt.sign(
      { userId: 'mock-user-id' }, // Replace with actual user ID
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: 'mock-user-id',
        email,
        username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // TODO: Find user with Prisma
    // const user = await prisma.user.findUnique({ where: { email } });
    // if (!user) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // TODO: Verify password
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // Generate JWT token
    const token = jwt.sign(
      { userId: 'mock-user-id' }, // Replace with actual user ID
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: 'mock-user-id',
        email,
        username: 'mock-username',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
authRouter.get('/profile', async (req: Request, res: Response) => {
  try {
    // TODO: Extract user from JWT token middleware
    // const userId = req.user.id;

    // TODO: Get user with preferences from Prisma
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   include: { preferences: true }
    // });

    res.json({
      user: {
        id: 'mock-user-id',
        email: 'mock@example.com',
        username: 'mock-username',
        preferences: {
          favoriteFlavors: ['sweet', 'fruity'],
          favoriteIngredients: ['gin', 'lime'],
          dietaryRestrictions: [],
        },
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default authRouter;
