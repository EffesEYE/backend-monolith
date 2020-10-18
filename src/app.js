import cors from 'cors';
import path from 'path';
import express from 'express';
import moesif from 'moesif-nodejs';
import pino from 'express-pino-logger';
import * as APIValidator from 'express-openapi-validator';

import endpoints from './endpoints';

// TODO add API versioning
const app = express();
const APIVersion = process.env.API_VERSION;

const apiMonitor = moesif({
  applicationId: process.env.MOESIF_ID
});

const apiSpec = path.join(__dirname, 'api-spec.yaml');
app.use(`/${APIVersion}/spec`, express.static(apiSpec));
app.use(cors());
app.use(apiMonitor);
app.use(express.json());
// app.use(pino({ useLevel: 'info' }));
app.use(
  APIValidator.middleware({
    apiSpec,
    validateRequests: true
  })
);

app.use(`/${APIVersion}`, endpoints.hello);
app.use(`/${APIVersion}/ping`, endpoints.ping);
app.use(`/${APIVersion}/register`, endpoints.register);

app.use((err, req, res, next) => {
  // TODO log this to the API monitoring service
  res.status(err.status || 500).json({
    message: err.message
  });
});

export default app;
