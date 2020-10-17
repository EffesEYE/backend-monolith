import cors from 'cors';
import path from 'path';
import express from 'express';
import moesif from 'moesif-nodejs';
import pino from 'express-pino-logger';
import * as APIValidator from 'express-openapi-validator';

import endpoints from './endpoints';

// TODO add API versioning
const app = express();

const apiMonitor = moesif({
  applicationId: process.env.MOESIFID
});

const apiSpec = path.join(__dirname, 'api-spec.yaml');
app.use('/spec', express.static(apiSpec));
app.use(cors());
app.use(apiMonitor);
app.use(express.json());
app.use(pino({ useLevel: 'info' }));
app.use(
  APIValidator.middleware({
    apiSpec,
    validateRequests: true
  })
);

app.use('/register', endpoints.register);

const defaultResponse = 'Welcome to the EffesEYE API. Consult the documentation';
app.get('/', (req, res) => res.status(200).send({ message: defaultResponse }));
app.post('/', (req, res) => res.status(200).send({ message: defaultResponse }));
app.get('/ping', (req, res) => res.status(200).send({ message: `EffesEYE API: ${new Date()}` }));
app.post('/ping', (req, res) => res.status(200).send({ message: `EffesEYE API: ${new Date()}` }));
app.get('*', (req, res) => res.status(400).json({ message: 'Invalid Destination' }));
app.post('*', (req, res) => res.status(400).json({ message: 'Invalid Destination' }));

app.use((err, req, res, next) => {
  // TODO log this to the API monitoring service
  res.status(err.status || 500).json({
    message: err.message
  });
});

export default app;
