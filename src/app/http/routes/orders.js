import Router from 'router';
import OrderController from 'controllers/Order';
import CartMiddlewares from 'middlewares/cart';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import {canAccessToAdmin, canReadAnyOrder} from 'middlewares/casbin/admin';
import {canBuy, canReadOrder} from 'middlewares/casbin/customer';

// eslint-disable-next-line new-cap
const router = Router();

router.post('/',
    AuthMiddlewares.authorization,
    validator,
    canBuy,
    CartMiddlewares.bindCart,
    CartMiddlewares.validateTotal,
    OrderController.create
);

router.get('/:order',
    AuthMiddlewares.authorization,
    canReadOrder,
    OrderController.getOrder
);

router.get('/',
    AuthMiddlewares.authorization,
    canAccessToAdmin,
    canReadAnyOrder,
    OrderController.getAll
);

export default router;
