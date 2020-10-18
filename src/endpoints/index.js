import { Router } from 'express';
import jwt from 'express-jwt';
import register from './register';

const ping = Router();
const hello = Router();
const defaultResponse = `EffesEYE API: ${new Date()}`;

const authenticate = jwt({
  algorithms: ['HS256'],
  secret: process.env.AUTH_SECRET,
  expiresIn: 60 * 30 // expire/refresh the token after 30 mins
});

register.use(authenticate);

ping.get('/', (req, res) => res.status(200).send({ message: defaultResponse }));
ping.post('/', (req, res) => res.status(200).send({ message: defaultResponse }));
hello.get('/', (req, res) => res.status(200).send({ message: defaultResponse }));
hello.post('/', (req, res) => res.status(200).send({ message: defaultResponse }));

export default {
  ping,
  hello,
  register
};
