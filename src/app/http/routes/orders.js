import Router from 'router';
import OrderController from 'controllers/Order';
import CartMiddlewares from 'middlewares/cart';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';

// eslint-disable-next-line new-cap
const router = Router();

router.post('/',
    AuthMiddlewares.authentication,
    AuthMiddlewares.authenticated,
    validator,
    CartMiddlewares.bindCart,
    CartMiddlewares.validateTotal,
    OrderController.create
);

router.get('/:order',
    AuthMiddlewares.authentication,
    AuthMiddlewares.authenticated,
    validator,
    OrderController.getOrder
);

router.get('/',
    AuthMiddlewares.authentication,
    AuthMiddlewares.authenticated,
    OrderController.getAll
);

export default router;
