import { Router } from 'express';
import { login } from '../../commons/auth';

const router = Router();
router.post('/', async (req, res) => login(req, res, 'USER'));

export default router;
