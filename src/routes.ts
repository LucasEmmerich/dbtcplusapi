import { Router } from 'express';
import GlucoseRecordController from './controllers/glucose-record-controller';
import AuthController from './controllers/auth-controller';

const router = Router();

router.get('/login', AuthController.prototype.login);
router.get('/list', GlucoseRecordController.prototype.list);

export default router;