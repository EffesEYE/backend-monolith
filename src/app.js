import cors from 'cors';
import express from 'express';
import pino from 'express-pino-logger';

import endpoints from './endpoints';

const app = express();

app.use(cors());
app.use(express.json());
app.use(pino());

app.use('/register', endpoints.register);

export default app;
