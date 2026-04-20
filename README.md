# Swahilipot Hub Community Manager

Welcome to the **Swahilipot Hub Community Manager** platform, a comprehensive system for managing community engagement, members, and events. This system is designed for high-performance management tasks including member registration, event scheduling, and real-time dashboard analytics.

---

## 🚀 Key Features

### 1. Unified Dashboard
- **Live Metrics**: Real-time counts for total members, active events, and attendance rates.
- **Engagement Analytics**: Visual trends for member growth and event feedback sentiment.
- **At-Risk Monitoring**: Automated identification of members who haven't attended events recently.

### 2. Member Management
- **Add Single Members**: Dedicated modal for quick registration with regional (Zone) assignment.
- **Bulk CSV Import**: Powerful importer for migrating large datasets (up to 500 members per batch).
- **Member Timeline**: Full history of event attendance and feedback for each member.

### 3. Event Management
- **Dynamic Scheduling**: Create events linked to specific Programs (Mentorship, Workshops).
- **QR Code Integration**: Generates unique identifiers for event check-ins.
- **Conflict Detection**: Prevents overlapping events in the same location.

### 4. Role-Based Access Control
- **Admin**: Full system management (Users, Programs, Backups).
- **Community Manager**: Member registration and event oversight.
- **Case Manager**: Direct member engagement and followup.

---

## 🛠 Setup & Installation (Zero-to-Hero)

### Prerequisites
- **Node.js**: v18 or higher.
- **MySQL**: (via XAMPP or standalone). Default port 3306.

### Step 1: Backend Setup
1. **Database Configuration**:
   - Ensure MySQL is running.
   - Configure `backend/.env`:
     ```env
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_NAME=swahilipot_community_db
     DB_USER=root
     DB_PASSWORD=
     ```

2. **Database Initialization**:
   - Install dependencies: `npm install`
   - Create Database: `node create-db.js`
   - Run Migrations: `npx sequelize-cli db:migrate`
   - Seed Initial Data: `npx sequelize-cli db:seed:all`

3. **Start the Server**:
   - `npm start`
   - Verify log: `Database connection established successfully.`

### Step 2: Frontend Setup
1. **Configure Environment**:
   - Edit `frontend/.env.local`:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```

2. **Start the Development Server**:
   - `npm install`
   - `npm run dev`

---

## 🔍 Troubleshooting

### 1. `ECONNREFUSED` on port 3306
- **Problem**: Backend cannot reach MySQL.
- **Fix**: Ensure XAMPP's MySQL service is **Started**. If using a custom port, update `DB_PORT` in your `.env`.

### 2. `EADDRINUSE` on port 5000
- **Problem**: Port 5000 is already occupied.
- **Fix**: Run `Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force` in PowerShell (Windows) to clear it.

### 3. Missing Migration method: `up`
- **Problem**: Old seeder format in ES modules.
- **Fix**: Ensure your seeder uses `export default { up: async (queryInterface, Sequelize) => { ... } }`.

---

## 🏗 Built By
**Antigravity** for the **Swahilipot Hub** team.
Dedicated to data-driven community empowerment.
