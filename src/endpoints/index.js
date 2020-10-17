import path from 'path';
import openapi from 'openapi-validator-middleware';

import registerEndpoint from './register';

export const apiSpec = path.join(__dirname, '../api-spec.yaml');
openapi.init(apiSpec, {
  framework: 'express',
  beautifyErrors: true
});

export const API = openapi;
export const endpoints = {
  register: registerEndpoint(API)
};
