import cors from 'cors';
import express from 'express';
import moesif from 'moesif-nodejs';
import pino from 'express-pino-logger';

import { apiSpec, API, endpoints } from './endpoints';

// TODO add API versioning
const app = express();

// Setup middlewares
const apiMonitor = moesif({
  applicationId: process.env.MOESIFID
});

app.use('/spec', express.static(apiSpec));
app.use(cors());
// app.use(apiMonitor);
app.use(express.json());
app.use(pino({ useLevel: 'info' }));
// Done with middlewares

// app.use('/register', endpoints.register);
app.post('/register', API.validate, (req, res) => {
  console.log('reached validated endpoint!');
  res.json({ message: 'done' });
});

const defaultResponse = 'Welcome to the EffesEYE API. Consult the documentation';
app.get('/', (req, res) => res.status(200).send(defaultResponse));
app.post('/', (req, res) => res.status(200).send(defaultResponse));
app.get('/ping', (req, res) => res.status(200).send(`EffesEYE API: ${new Date()}`));
app.post('/ping', (req, res) => res.status(200).send(`EffesEYE API: ${new Date()}`));

app.use((err, req, res) => {
  if (err instanceof API.InputValidationError) {
    return res.status(400).json({ info: JSON.stringify(err.errors) });
  }
});

export default app;
