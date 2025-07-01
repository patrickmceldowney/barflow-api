# Railway Deployment Guide for Barflow API

This guide will help you deploy your Barflow API to Railway with a PostgreSQL database.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Install the Railway CLI
   ```bash
   npm install -g @railway/cli
   ```
3. **Git Repository**: Your code should be in a Git repository

## Quick Deployment

### Option 1: Automated Script (Recommended)

#### Windows
```bash
# Run the deployment script
scripts\railway-deploy.bat

# Or run specific steps
scripts\railway-deploy.bat migrate  # Run migrations only
scripts\railway-deploy.bat seed     # Seed database only
scripts\railway-deploy.bat env      # Set up environment variables only
```

#### Linux/Mac
```bash
# Make script executable
chmod +x scripts/railway-deploy.sh

# Run the deployment script
./scripts/railway-deploy.sh

# Or run specific steps
./scripts/railway-deploy.sh migrate  # Run migrations only
./scripts/railway-deploy.sh seed     # Seed database only
./scripts/railway-deploy.sh env      # Set up environment variables only
```

### Option 2: Manual Deployment

#### Step 1: Login to Railway
```bash
railway login
```

#### Step 2: Initialize Railway Project
```bash
# Link to existing project or create new one
railway link
# OR
railway init
```

#### Step 3: Create PostgreSQL Database
```bash
# Create PostgreSQL service
railway service create --name barflow-postgres --type postgresql

# Get the database URL
railway variables get DATABASE_URL --service barflow-postgres
```

#### Step 4: Set Environment Variables
```bash
# Set required environment variables
railway variables set DATABASE_URL="your-database-url"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set API_KEY="your-api-key"
railway variables set CORS_ORIGIN="*"
railway variables set NODE_ENV="production"
```

#### Step 5: Run Database Migrations
```bash
# Set DATABASE_URL for local use
set DATABASE_URL="your-database-url"  # Windows
# OR
export DATABASE_URL="your-database-url"  # Linux/Mac

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

#### Step 6: Deploy Application
```bash
railway up
```

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET` | Secret for JWT token signing | `your-secret-key-here` |
| `API_KEY` | API key for external access | `your-api-key-here` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` or `https://yourdomain.com` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Port to run the server on | `3000` (auto-set by Railway) |

## Database Setup

### Automatic Setup
The deployment script will automatically:
1. Create a PostgreSQL database
2. Run Prisma migrations
3. Seed the database with initial data

### Manual Database Setup
If you need to set up the database manually:

```bash
# Connect to your Railway database
railway connect --service barflow-postgres

# Or use the DATABASE_URL directly
npx prisma db push
npx prisma migrate deploy
npx prisma db seed
```

## API Endpoints

Once deployed, your API will be available at:
```
https://your-app-name.railway.app
```

### Public Endpoints (No Authentication Required)
- `GET /api/cocktails` - Get all cocktails
- `GET /api/cocktails/:id` - Get specific cocktail
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/recommendations` - Get cocktail recommendations

### Protected Endpoints (Authentication Required)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/account` - Delete account
- `GET /api/user/stats` - Get user statistics
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Update user preferences
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add cocktail to favorites
- `DELETE /api/favorites/:id` - Remove cocktail from favorites

## Authentication

The API uses JWT tokens for authentication:

1. **Register/Login**: Get a JWT token
2. **Protected Routes**: Include token in Authorization header
   ```
   Authorization: Bearer your-jwt-token
   ```

## Monitoring and Logs

### View Logs
```bash
railway logs
```

### Monitor Performance
- Check Railway dashboard for metrics
- Use the health check endpoint: `GET /health`

### Database Monitoring
```bash
# Connect to database
railway connect --service barflow-postgres

# View database logs
railway logs --service barflow-postgres
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` environment variable
   - Ensure database service is running
   - Verify network connectivity

2. **Migrations Failed**
   - Check database permissions
   - Ensure schema is compatible
   - Run `npx prisma migrate reset` if needed

3. **Build Failed**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

4. **Environment Variables Missing**
   - Verify all required variables are set
   - Check variable names and values
   - Restart the service after setting variables

### Debug Commands

```bash
# Check Railway status
railway status

# View environment variables
railway variables

# Connect to running service
railway connect

# View service logs
railway logs --service your-service-name
```

## Scaling and Performance

### Auto-scaling
Railway automatically scales your application based on traffic.

### Database Optimization
- Monitor query performance
- Add database indexes as needed
- Consider connection pooling for high traffic

### Caching
Consider adding Redis for caching:
```bash
# Add Redis service
railway service create --name barflow-redis --type redis
```

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **JWT Secrets**: Use strong, random secrets
3. **CORS**: Restrict CORS origins in production
4. **Rate Limiting**: Already implemented in the API
5. **Input Validation**: All endpoints validate input
6. **HTTPS**: Railway provides SSL certificates automatically

## Cost Optimization

1. **Database**: Start with Railway's free tier
2. **Compute**: Monitor usage and adjust as needed
3. **Storage**: Clean up unused data regularly

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Project Issues**: Check the GitHub repository

## Next Steps

After successful deployment:

1. **Test all endpoints** using the API documentation
2. **Set up monitoring** and alerts
3. **Configure custom domain** if needed
4. **Set up CI/CD** for automatic deployments
5. **Monitor performance** and optimize as needed 
