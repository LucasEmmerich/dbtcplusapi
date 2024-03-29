import { Router } from 'express';
import AuthController from './controllers/auth-controller';
import GlucoseRecordController from './controllers/glucose-record-controller';
import UserController from './controllers/user-controller';

const router = Router();
const authNeeded = AuthController.prototype.authMiddleware;

router.post('/user/authenticate', AuthController.prototype.authenticate);

router.get("/status", (req, res) => {
    return res.json({
        status: 'good',
        responsetime: '150ms'
    });
});

router.post('/user', UserController.prototype.create);
router.put('/user', authNeeded, UserController.prototype.update);
router.get('/user/emailexists', UserController.prototype.emailExists);
router.get('/user/loginexists', UserController.prototype.loginExists);
router.get('/user/activateAccount', UserController.prototype.activateAccount);
router.get('/user/dashboardData',authNeeded , UserController.prototype.getDashboardData);

router.get('/glucose-record', authNeeded, GlucoseRecordController.prototype.list);
router.post('/glucose-record', authNeeded, GlucoseRecordController.prototype.create);
router.put('/glucose-record/:id', authNeeded, GlucoseRecordController.prototype.update);
router.delete('/glucose-record/:id', authNeeded, GlucoseRecordController.prototype.delete);
router.get('/glucose-record/list-consumption', authNeeded, GlucoseRecordController.prototype.listConsumption);
router.get('/glucose-record/getBestDosages', authNeeded, GlucoseRecordController.prototype.getBestDosages);

//reports
router.get('/glucose-record/reports/daily-doses', authNeeded, GlucoseRecordController.prototype.getDailyDosesReport);
router.get('/glucose-record/reports/daily-glycemia', authNeeded, GlucoseRecordController.prototype.getDailyGlycemiaAverageReport);

export default router;