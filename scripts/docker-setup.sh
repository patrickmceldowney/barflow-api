#!/bin/bash

# Barflow Docker Setup Script
# This script sets up the local development environment with Docker

set -e

echo "🍸 Setting up Barflow development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://barflow_user:barflow_password@localhost:5432/barflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Configuration
API_KEY=your-admin-api-key-change-this-in-production
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U barflow_user -d barflow; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Display connection information
echo ""
echo "🎉 Setup complete! Here's your connection information:"
echo ""
echo "📊 PostgreSQL Database:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: barflow"
echo "   Username: barflow_user"
echo "   Password: barflow_password"
echo ""
echo "🖥️  pgAdmin (Database Management):"
echo "   URL: http://localhost:5050"
echo "   Email: admin@barflow.local"
echo "   Password: admin123"
echo ""
echo "🚀 API Server:"
echo "   URL: http://localhost:3000"
echo "   Health Check: http://localhost:3000/health"
echo ""
echo "📚 Next steps:"
echo "   1. Install dependencies: npm install"
echo "   2. Set up Prisma: npm install prisma @prisma/client"
echo "   3. Initialize Prisma: npx prisma init"
echo "   4. Generate Prisma client: npx prisma generate"
echo "   5. Run migrations: npx prisma migrate dev"
echo "   6. Start development server: npm run dev"
echo ""
echo "🛑 To stop the containers: docker-compose down"
echo "🗑️  To remove everything: docker-compose down -v" 