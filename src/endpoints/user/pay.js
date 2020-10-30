import { Router } from 'express';
import { atlabs } from 'innovation-sandbox';

import DB from '../../data/db/models';
import { requiresAuth } from '../../commons/auth';

const router = Router();

const sendAirtime = async (payload) => {
  const { amount, currency, sendTo: phoneNumber } = payload;
  const outcome = await atlabs.Airtime.SendAirtime({
    sandbox_key: process.env.SANDBOX_KEY,
    payload: {
      recipients: [{ phoneNumber, amount, currencyCode: currency }]
    }
  });

  const {
    responses: [{ requestId }]
  } = outcome;
  return requestId;
};

const fsiNoOpService = async () => {};
const SERVICES = {
  airtime: sendAirtime,
  tv: fsiNoOpService,
  electricity: fsiNoOpService
};

const lodgePayment = async (payload) => {
  const { email, amount, currency, sendTo, service, provider, accountToDebit } = payload;

  // TODO check that this record exists before proceeding
  const user = await DB.User.findOne({ where: { email } });

  const payment = await DB.Payment.create({
    amount,
    currency,
    status: 'SUCCEEDED',
    user: user.dataValues.id,
    tnxtype: service.toUpperCase(),
    tnxdetails: JSON.stringify({
      sendTo,
      provider,
      service,
      debited: accountToDebit
    })
  });

  user.lasttnx = new Date();
  user.save();

  return payment.dataValues.id;
};

const payForService = async (payload) => {
  const { service } = payload;
  const provideService = SERVICES[service] || fsiNoOpService;

  const serviceReqId = await provideService(payload);
  const paymentReqId = await lodgePayment(payload);

  return { serviceReqId, paymentReqId };
};

const makePayment = async (req, res) => {
  const { email } = req.user;
  const { service } = req.params;
  const { amount, currency, provider, sendTo, accountToDebit } = req.body;

  try {
    const { serviceReqId, paymentReqId } = await payForService({
      service,
      amount,
      currency,
      provider,
      sendTo,
      email,
      accountToDebit
    });

    res.status(201).json({
      status: 'SUCCEEDED',
      paymentId: paymentReqId,
      message: 'payment completed',
      details: { serviceReqId }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Unable to handle your payment request' });
  }
};

const checkPaymentStatus = async (req, res) => {
  const { email } = req.user;
  const { paymentId } = req.params;

  try {
    const user = await DB.User.findOne({ where: { email } });
    const { id: userId, accounttype } = user.dataValues;

    const condition = { id: paymentId };
    if (accounttype !== 'ADMIN') {
      // if the current session is not owned by an admin
      // then lets make sure users dont have access to
      // other users' payment info
      condition.user = userId;
    }

    const payment = await DB.Payment.findOne({ where: condition });
    const { status } = payment.dataValues;

    res.status(201).json({
      status,
      paymentId,
      message: 'payment completed'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Unable to handle your payment enquiry' });
  }
};

router.post('/:service', requiresAuth, makePayment);
router.get('/:paymentId/status', requiresAuth, checkPaymentStatus);

export default router;
