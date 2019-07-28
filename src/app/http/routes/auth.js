import Router from 'router';
import AuthController from 'controllers/Auth';
import middleware from 'middlewares/auth';
import validator from 'middlewares/validator';

// eslint-disable-next-line new-cap
const router = Router();

router.post('/login', AuthController.login);
router.post('/facebook', AuthController.facebook);
router.post('/google', AuthController.google);
router.post('/register', validator, AuthController.register);

router.get('/me', middleware.authenticated, AuthController.whoami);

export default router;
