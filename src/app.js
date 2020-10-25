import cors from 'cors';
import path from 'path';
import express from 'express';
import moesif from 'moesif-nodejs';
import pino from 'express-pino-logger';
import * as APIValidator from 'express-openapi-validator';

import endpoints from './endpoints';

const app = express();
const APIVersion = process.env.API_VERSION;

const apiMonitor = moesif({
  applicationId: process.env.MOESIF_ID
});

// Monitor API usage
app.use(apiMonitor);

// Serve basic static assets
// In this case, just the standard icon and the API spec
const apiSpec = path.join(__dirname, 'api-spec.yaml');
app.use(`/${APIVersion}/spec`, express.static(apiSpec));

const ico = path.join(__dirname, 'logo-dark.ico');
app.use('/favicon.ico', express.static(ico));

// Add other critical middleware
app.use(cors());
app.use(express.json());
app.use(pino({ useLevel: 'info' }));
app.use(
  APIValidator.middleware({
    apiSpec,
    validateRequests: true
  })
);

// Meta endpoints
app.use('/', endpoints.hello);
app.use(`/${APIVersion}`, endpoints.hello);
app.use(`/${APIVersion}/ping`, endpoints.ping);

// Route to the business of this platform!
app.use(`/${APIVersion}/register`, endpoints.register);
app.use(`/${APIVersion}/auth/user-login`, endpoints.login.user);
app.use(`/${APIVersion}/auth/admin-login`, endpoints.login.admin);
app.use(`/${APIVersion}/auth/verify-token`, endpoints.login.verify);

app.use(`/${APIVersion}/bo/users`, endpoints.admin.manageUsers);
app.use(`/${APIVersion}/bo/payments`, endpoints.admin.managePayments);
app.use(`/${APIVersion}/account/add-bank`, endpoints.user.addBankAccount);

// Catch-all error handler
app.use((err, req, res, next) => {
  // TODO log this to the API monitoring service
  console.log('Err Path: ', req.path);
  res.status(err.status || 500).json({
    message: err.message
  });
});

export default app;
