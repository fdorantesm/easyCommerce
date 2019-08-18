import Router from 'router';
import OrderController from 'controllers/Order';
import CartMiddlewares from 'middlewares/cart';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import {canAccessToAdmin, canReadAnyOrder} from 'middlewares/admin';
import {canBuy, canReadOrder} from 'middlewares/customer';

// eslint-disable-next-line new-cap
const router = Router();

router.post('/',
    AuthMiddlewares.authentication,
    AuthMiddlewares.authenticated,
    validator,
    canBuy,
    CartMiddlewares.bindCart,
    CartMiddlewares.validateTotal,
    OrderController.create
);

router.get('/:order',
    AuthMiddlewares.authentication,
    AuthMiddlewares.authenticated,
    canReadOrder,
    OrderController.getOrder
);

router.get('/',
    AuthMiddlewares.authentication,
    AuthMiddlewares.authenticated,
    canAccessToAdmin,
    canReadAnyOrder,
    OrderController.getAll
);

export default router;
