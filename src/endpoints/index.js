import { Router } from 'express';
import register from './register';

const ping = Router();
const hello = Router();
const defaultResponse = `EffesEYE API: ${new Date()}`;

ping.get('/', (req, res) => res.status(200).send({ message: defaultResponse }));
ping.post('/', (req, res) => res.status(200).send({ message: defaultResponse }));
hello.get('/', (req, res) => res.status(200).send({ message: defaultResponse }));
hello.post('/', (req, res) => res.status(200).send({ message: defaultResponse }));

export default {
  ping,
  hello,
  register
};
