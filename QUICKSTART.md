# Swahilipot Hub Community Manager - Quick Start

## Prerequisites
- Node.js v18+
- MySQL (via XAMPP or standalone) running on port 3306

## One-Command Startup

### Windows PowerShell
```powershell
# Start both backend and frontend together
cd backend; $backend = Start-Process npm -ArgumentList "run dev" -PassThru; cd ../frontend; $frontend = Start-Process npm -ArgumentList "run dev" -PassThru
```

### Separate terminals (recommended)
```bash
# Terminal 1 - Backend
cd backend
npm install
node create-db.js
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## Default Login (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@swahilipot.org | admin123 |
| Case Manager | case.manager@swahilipot.org | admin123 |

## Verified Connections
✅ All 32 API endpoints connected
✅ JWT authentication with auto-attach
✅ CORS configured for localhost:5173
✅ Data transformations applied
✅ ESLint: 0 errors
