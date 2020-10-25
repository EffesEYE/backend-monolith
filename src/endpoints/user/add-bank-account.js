import { Router } from 'express';
import { sterling } from 'innovation-sandbox';

import DB from '../../data/db/models';
import { requiresAuth } from '../../commons/auth';

const router = Router();

const verifyBankAccount = async (nuban) => {
  const { message, data } = await sterling.Transfer.InterbankNameEnquiry({
    sandbox_key: process.env.SANDBOX_KEY,
    params: {
      Referenceid: '01',
      RequestType: '01',
      Translocation: '01',
      ToAccount: nuban,
      destinationbankcode: '000001'
    },
    subscription_key: 't',
    Appid: '69',
    ipval: '0',
    host: null
  });

  return message === 'OK' && data.message === 'success';
};

const addBankAccountEndpoint = async (req, res) => {
  const { email } = req.user;
  const { nuban, bankname } = req.body;

  try {
    const verified = await verifyBankAccount(nuban);
    if (!verified) return res.status(403).json({ message: 'Invalid account number' });

    const user = await DB.User.findOne({ where: { email } });
    if (!user) return res.status(403).json({ message: 'Invalid EffesEYE account' });

    await DB.BankAccount.create({
      nuban,
      bank: bankname,
      userId: user.dataValues.id
    });

    res.status(201).json({
      status: 'SUCCEEDED',
      message: 'added bank account'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Unable to handle your request' });
  }
};

router.post('/', requiresAuth, addBankAccountEndpoint);

export default router;
