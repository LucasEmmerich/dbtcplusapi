import { Router } from 'express';
import GlucoseRecordController from './controllers/glucose-record-controller';
import AuthController from './controllers/auth-controller';
import UserController from './controllers/user-controller';

const router = Router();

router.post('/user', UserController.prototype.create);
// router.get('/list', GlucoseRecordController.prototype.list);

export default router;