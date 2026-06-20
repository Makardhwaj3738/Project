@echo off
echo Starting AI Travel Planner Backend...
start cmd /k "cd backend && if not exist node_modules npm install && npm run dev"

echo Starting AI Travel Planner Frontend...
start cmd /k "cd frontend && if not exist node_modules npm install && npm run dev"

echo Servers are starting! 
echo Frontend will be available at http://localhost:3000
echo Backend API will be available at http://localhost:5001
