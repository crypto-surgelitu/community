import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 5000,
  logLevel: process.env.LOG_LEVEL || 'info',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'swahilipot_community_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    }
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expire: process.env.JWT_EXPIRE || '24h'
  },

  session: {
    timeout: parseInt(process.env.SESSION_TIMEOUT) || 3600000
  },

  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
    maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) || 900000
  },

  qrCode: {
    namespace: process.env.QR_CODE_NAMESPACE || 'swahilipot-event',
    version: parseInt(process.env.QR_CODE_VERSION) || 2
  },

  notifications: {
    whatsappApiUrl: process.env.WHATSAPP_API_URL,
    whatsappApiKey: process.env.WHATSAPP_API_KEY,
    africaTalkingApiKey: process.env.AFRICAS_TALKING_API_KEY,
    africaTalkingUsername: process.env.AFRICAS_TALKING_USERNAME
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD
  },

  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
    allowedExtensions: (process.env.ALLOWED_EXTENSIONS || 'csv,xlsx').split(',')
  },

  features: {
    enableUssd: process.env.ENABLE_USSD === 'true',
    enableWhatsapp: process.env.ENABLE_WHATSAPP === 'true',
    maxMembersPerImport: parseInt(process.env.MAX_MEMBERS_PER_IMPORT) || 500,
    maxEventsCalendar: parseInt(process.env.MAX_EVENTS_CALENDAR) || 365
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  }
};
