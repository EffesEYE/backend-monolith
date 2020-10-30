import { Router } from 'express';

import register from './register';
import userLogin from './user/login';
import adminLogin from './admin/login';
import verifyToken from './verify-token';
import manageUsers from './admin/manage-users';
import managePayments from './admin/manage-payments';
import addBankAccount from './user/add-bank-account';
import handlePayments from './user/pay';

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
  login: {
    user: userLogin,
    admin: adminLogin,
    verify: verifyToken
  },
  register,
  admin: {
    manageUsers,
    managePayments
  },
  user: {
    addBankAccount,
    handlePayments
  }
};
