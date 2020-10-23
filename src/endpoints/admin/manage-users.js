import { Router } from 'express';

import DB from '../../data/db/models';
import { requiresAuth } from '../../commons/auth';

const manageUsers = async (req, res) => {
  const users = await DB.User.findAll({
    attributes: ['accountId', 'accounttype', 'firstname', 'lastname', 'email', 'lastseen', ['createdAt', 'membersince']]
  });

  console.log(users);

  const data = users.map(({ dataValues }) => ({ ...dataValues }));
  res.status(200).json({
    data,
    message: 'fetch successful'
  });
};

const router = Router();
router.get('/', requiresAuth, manageUsers);

export default router;