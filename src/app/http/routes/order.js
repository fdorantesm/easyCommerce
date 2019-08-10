import Router from 'router';
import OrderController from 'controllers/Order';
import CartMiddlewares from 'middlewares/cart';
import AuthMiddlewares from 'middlewares/auth';

// eslint-disable-next-line new-cap
const router = Router();

// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authentication, CartMiddlewares.bindCart, OrderController.create);

export default router;
