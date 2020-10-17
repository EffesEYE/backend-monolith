import cors from 'cors';
import express from 'express';
import moesif from 'moesif-nodejs';
import pino from 'express-pino-logger';

import endpoints from './endpoints';

// Setup middlewares
const apiMonitor = moesif({
  applicationId: process.env.MOESIFID
});

const app = express();
app.use(cors());
app.use(apiMonitor);
app.use(express.json());
// app.use(pino());

app.use('/register', endpoints.register);

export default app;
