import { Router } from 'express';
import { verifyAuthToken } from '../commons/auth';

const router = Router();
router.post('/', async (req, res) => {
  let verified = false;
  const { token } = req.body;
  if (!token) res.status(200).json({ verified });

  verified = verifyAuthToken(token);
  res.status(200).json({ verified });
});

export default router;
