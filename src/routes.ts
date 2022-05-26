import { Router } from 'express';
import AuthController from './controllers/auth-controller';
import GlucoseRecordController from './controllers/glucose-record-controller';
import UserController from './controllers/user-controller';
import ping from 'ping';

const router = Router();
const authNeeded = AuthController.prototype.authMiddleware;

router.post('/user/authenticate', AuthController.prototype.authenticate);

router.get("/status", (req, res) => {
    return res.json({
        status: 'good',
        response_time: '150ms'
    });
});

router.post('/user', UserController.prototype.create);
router.put('/user', authNeeded, UserController.prototype.update);
router.get('/user/emailexists', UserController.prototype.emailExists);
router.get('/user/loginexists', UserController.prototype.loginExists);
router.get('/user/activateAccount', UserController.prototype.activateAccount);

router.get('/glucose-record', authNeeded, GlucoseRecordController.prototype.list);
router.post('/glucose-record', authNeeded, GlucoseRecordController.prototype.create);
router.put('/glucose-record/:id', authNeeded, GlucoseRecordController.prototype.update);
router.delete('/glucose-record/:id', authNeeded, GlucoseRecordController.prototype.delete);
// router.get('/list', GlucoseRecordController.prototype.list);

export default router;