import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { nibss } from 'innovation-sandbox';

const router = Router();

router.post('/', async (req, res) => {
  res.json(req.body);
});

export default router;
