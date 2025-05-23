#!/bin/bash

echo "🚀 Starting Vibeton Game..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Building and starting containers..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ Vibeton Game is starting up!"
echo ""
echo "🌐 Access the application:"
echo "   - Game: http://localhost"
echo "   - API Docs: http://localhost/api/docs"
echo "   - MongoDB: localhost:27017"
echo ""
echo "📋 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"
echo ""
echo "🔧 For development:"
echo "   Backend: cd backend && pip install -r requirements.txt && uvicorn main:app --reload"
echo "   Frontend: cd frontend && npm install && npm run dev" 