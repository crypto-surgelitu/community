export const logger = {
  log: (msg, data = {}) => {
    console.log(`[LOG] ${new Date().toISOString()} - ${msg}`, data);
  },
  
  error: (msg, err = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, err);
  },
  
  warn: (msg, data = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data);
  },
  
  debug: (msg, data = {}) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`, data);
    }
  }
};
