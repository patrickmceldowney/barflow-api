# Barflow API

A cocktail management API built with Express.js and TypeScript, featuring user authentication, personalized recommendations, and a comprehensive cocktail database.

## Features

- 🍸 RESTful API for cocktail management
- 🔐 JWT-based user authentication
- 🎯 Personalized cocktail recommendations
- 💾 User preferences and favorites
- 📊 PostgreSQL database with Docker
- 🛡️ Security features (rate limiting, CORS, helmet)
- 📝 Comprehensive API documentation
- 🐳 Docker support for easy deployment

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Quick Start with Docker

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd barflow-api
```

### 2. Start Database with Docker

```bash
# Make the setup script executable
chmod +x scripts/docker-setup.sh

# Run the setup script
./scripts/docker-setup.sh
```

This will:
- Create a `.env` file with default values
- Start PostgreSQL database
- Start pgAdmin for database management
- Display connection information

### 3. Install Dependencies

```bash
npm install
```

### 4. Set up Prisma

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

## Manual Setup (without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/barflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# API Configuration
API_KEY=your-admin-api-key
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=development
```

### 3. Database Setup

Install and configure PostgreSQL, then run the Prisma setup commands above.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run seed` - Seed database (when Prisma is set up)
- `npm run seed-dry-run` - Dry run of database seeding
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Docker Commands

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Remove everything (including volumes)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/account` - Delete account
- `GET /api/user/stats` - Get user statistics

### Cocktails
- `GET /api/cocktails` - Get all cocktails
- `GET /api/cocktails/:id` - Get specific cocktail
- `POST /api/cocktails` - Create cocktail (admin)
- `DELETE /api/cocktails/:id` - Delete cocktail (admin)

### User Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences
- `GET /api/preferences/questionnaire` - Get preference questions

### Recommendations
- `POST /api/recommendations/cocktails` - Get personalized recommendations
- `GET /api/recommendations/discover` - Discover random cocktails
- `GET /api/recommendations/trending` - Get trending cocktails

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/:id` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites
- `GET /api/favorites/:id/check` - Check if favorited

## Database Management

### pgAdmin Access
- URL: http://localhost:5050
- Email: admin@barflow.local
- Password: admin123

### Direct Database Connection
- Host: localhost
- Port: 5432
- Database: barflow
- Username: barflow_user
- Password: barflow_password

## Production Deployment

### Docker Production

1. Create production environment file:
```bash
cp .env .env.production
# Edit .env.production with production values
```

2. Build and run production containers:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment Options

The API is ready for deployment on various platforms:

#### Railway (Recommended)
- **Quick Setup**: Use the automated deployment script
  ```bash
  # Windows
  scripts\railway-deploy.bat
  
  # Linux/Mac
  ./scripts/railway-deploy.sh
  ```
- **Manual Setup**: Connect your GitHub repository and set environment variables
- **Features**: Automatic PostgreSQL database, SSL certificates, auto-scaling
- **Documentation**: See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed guide

#### Render
- Connect your GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`

#### Heroku
- Add PostgreSQL addon
- Set environment variables
- Deploy with Git

#### DigitalOcean App Platform
- Connect your GitHub repository
- Configure environment variables
- Automatic scaling

#### AWS/GCP/Azure
- Use the provided Dockerfile
- Deploy to container services
- Set up managed PostgreSQL

## Project Structure

```
barflow-api/
├── api/
│   ├── index.ts              # API router
│   └── routes/
│       ├── auth.ts           # Authentication routes
│       ├── user.ts           # User management routes
│       ├── cocktail.ts       # Cocktail routes
│       ├── favorites.ts      # Favorites routes
│       ├── preferences.ts    # User preferences
│       └── recommendations.ts # Recommendation engine
├── tools/
│   ├── auth.ts              # JWT authentication middleware
│   ├── index.ts             # Utility functions
│   └── middleware.ts        # Express middleware
├── types/
│   ├── api.ts              # API type definitions
│   └── index.ts            # Core type definitions
├── tests/
│   └── main.test.ts        # API tests
├── scripts/
│   ├── docker-setup.sh     # Docker setup script
│   ├── railway-deploy.sh   # Railway deployment script (Linux/Mac)
│   ├── railway-deploy.bat  # Railway deployment script (Windows)
│   └── seed.ts             # Database seeding
├── docker/
│   └── postgres/
│       └── init.sql        # Database initialization
├── main.ts                 # Express server entry point
├── Dockerfile              # Production Docker image
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production environment
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── jest.config.js          # Jest test configuration
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests/15min)
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection (via Prisma)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Format code: `npm run format`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
