@echo off
echo 🚀 Starting Vibeton Game...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo 📦 Building and starting containers...
docker-compose up --build -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo 🔍 Checking service status...
docker-compose ps

echo.
echo ✅ Vibeton Game is starting up!
echo.
echo 🌐 Access the application:
echo    - Game: http://localhost
echo    - API Docs: http://localhost/api/docs
echo    - MongoDB: localhost:27017
echo.
echo 📋 To view logs:
echo    docker-compose logs -f
echo.
echo 🛑 To stop the application:
echo    docker-compose down
echo.
echo 🔧 For development:
echo    Backend: cd backend ^&^& pip install -r requirements.txt ^&^& uvicorn main:app --reload
echo    Frontend: cd frontend ^&^& npm install ^&^& npm run dev
echo.
pause 