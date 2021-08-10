import { Router } from 'express';
import UserController from './controllers/user-controller';

const router = Router();

router.post('/user', UserController.prototype.create);
router.put('/user', UserController.prototype.authMiddleware, UserController.prototype.update);
router.post('/user/authenticate', UserController.prototype.authenticate);
router.get('/user/emailexists', UserController.prototype.emailExists);
router.get('/user/loginexists', UserController.prototype.loginExists);
// router.get('/list', GlucoseRecordController.prototype.list);

export default router;