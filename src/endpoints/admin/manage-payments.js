import { Router } from 'express';

import DB from '../../data/db/models';
import { requiresAuth } from '../../commons/auth';

const managePayments = async (req, res) => {
  const payments = await DB.Payment.findAll({
    attributes: ['id', 'amount', 'currency', ['tnxtype', 'type'], 'status', ['createdAt', 'when']]
  });

  const data = payments.map(({ dataValues }) => ({ ...dataValues }));
  res.status(200).json({
    data,
    message: 'fetch successful'
  });
};

const router = Router();
router.get('/', requiresAuth, managePayments);

export default router;
