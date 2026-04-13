# Swahilipot Hub Community Manager - Backend API

## Project Overview

This is the backend API for the Swahilipot Hub Community Manager system. It provides RESTful endpoints for managing community members, events, attendance, feedback, and administrative functions.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Validation**: Joi

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 3. Create Database

```bash
mysql -u root -p -e "CREATE DATABASE swahilipot_community_db;"
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Initial Data

```bash
npm run seed
```

### 6. Start Server

```bash
npm start
```

The API will be available at `http://localhost:5000`

## Default Users

- **Admin**: admin@swahilipot.org / admin123
- **Case Manager**: case.manager@swahilipot.org / admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:eventId` - Get event details
- `PUT /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event
- `POST /api/events/:eventId/publish` - Publish event
- `POST /api/events/:eventId/checkin` - Check in member
- `GET /api/events/:eventId/attendance` - Get attendance

### Members
- `GET /api/members` - List members
- `POST /api/members` - Create member
- `GET /api/members/:memberId` - Get member details
- `PUT /api/members/:memberId` - Update member
- `DELETE /api/members/:memberId` - Delete member
- `POST /api/members/bulk-import` - Bulk import members
- `GET /api/members/:memberId/timeline` - Get member timeline
- `POST /api/members/:memberId/message` - Send message

### Feedback
- `POST /api/feedback/:eventId/feedback` - Submit feedback
- `GET /api/feedback/:eventId/feedback` - Get event feedback
- `GET /api/feedback/:eventId/feedback/analytics` - Get analytics
- `GET /api/feedback` - List all feedback

### Dashboard
- `GET /api/dashboard/metrics` - Get metrics
- `GET /api/dashboard/programs` - Get program stats
- `GET /api/dashboard/at-risk-members` - Get at-risk members

### Admin
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:userId` - Update user
- `POST /api/admin/users/:userId/reset-password` - Reset password
- `POST /api/admin/programs` - Create program
- `PUT /api/admin/programs/:programId` - Update program
- `GET /api/admin/backup` - Trigger backup

### Templates
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `GET /api/templates/:templateId` - Get template
- `PUT /api/templates/:templateId` - Update template
- `DELETE /api/templates/:templateId` - Delete template

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_NAME | Database name | swahilipot_community_db |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | root |
| JWT_SECRET | JWT secret | (change in production) |
| JWT_EXPIRE | Token expiry | 24h |

## Project Structure

```
backend/
├── config/          # Configuration files
├── database/        # Migrations and seeders
├── models/          # Sequelize models
├── routes/          # API routes
├── controllers/     # Route controllers
├── middleware/     # Express middleware
├── services/        # Business logic
├── utils/           # Utilities
└── server.js        # Entry point
```

## License

MIT
