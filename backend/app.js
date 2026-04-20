import express from 'express';
import cors from 'cors';
import { config } from './config/environment.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

const app = express();

app.use(cors({
  origin: config.cors.frontendUrl.includes(',') 
    ? config.cors.frontendUrl.split(',').map(u => u.trim()) 
    : config.cors.frontendUrl,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
