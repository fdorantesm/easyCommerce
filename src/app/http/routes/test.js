import Router from 'router';
import TestController from 'controllers/Test';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/hello', TestController.hello);

export default router;
