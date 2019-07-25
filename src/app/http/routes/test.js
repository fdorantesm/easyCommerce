import Router from 'router';
import TestController from 'controllers/Test';

const router = Router();

router.get('/hello', TestController.hello);

export default router;
