#!/bin/bash

# CafeShop Setup Verification Script
# This script helps verify that all components are working correctly

echo "🔍 CafeShop Setup Verification"
echo "=============================="

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed: $(docker --version)"
else
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is installed: $(docker-compose --version)"
elif docker compose version &> /dev/null; then
    echo "✅ Docker Compose (v2) is installed: $(docker compose version)"
else
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed: $(node --version)"
else
    echo "⚠️  Node.js is not installed. Required for local frontend development."
fi

# Check if Python is installed
if command -v python3 &> /dev/null; then
    echo "✅ Python is installed: $(python3 --version)"
else
    echo "⚠️  Python 3 is not installed. Required for local backend development."
fi

echo ""
echo "📋 Next Steps:"
echo "1. Copy backend/code/.env.example to backend/code/.env"
echo "2. Configure your environment variables in the .env file"
echo "3. Run: docker-compose up --build (in backend/code directory)"
echo "4. In another terminal, run: npm install --legacy-peer-deps && npm run dev (in frontend directory)"
echo ""
echo "🌐 Access Points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- API Docs: http://localhost:8000/docs"
echo "- Admin Panel: http://localhost:3000/admin"
echo ""
echo "📖 For more details, check the README.md file"