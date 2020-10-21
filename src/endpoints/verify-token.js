import { Router } from 'express';
import { verifyAuthToken } from '../commons/auth';

const router = Router();
router.post('/', async (req, res) => {
  let verified = false;
  const { token } = req.body;
  if (!token) res.status(200).json({ verified });

  verified = await verifyAuthToken(token);
  console.log(verified);
  res.status(200).json({ verified });
});

export default router;
