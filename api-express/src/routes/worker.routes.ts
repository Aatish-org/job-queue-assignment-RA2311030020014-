import { Router } from 'express';
import { listWorkers } from '../controllers/worker.controller';

const router = Router();

router.get('/', listWorkers);

export default router;

