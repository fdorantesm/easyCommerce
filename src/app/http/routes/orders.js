import Router from 'router';
import OrderController from 'controllers/OrderController';
import CartMiddlewares from 'middlewares/CartMiddlewares';
import AuthMiddlewares from 'middlewares/AuthMiddlewares';
import validator from 'middlewares/validator';
import OrderMiddlewares from 'middlewares/casbin/OrderMiddlewares';

// eslint-disable-next-line new-cap
const router = Router();

// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, OrderMiddlewares.canCreateOrder, validator, CartMiddlewares.bindCart, CartMiddlewares.validateTotal, OrderController.create);
// eslint-disable-next-line max-len
router.get('/:order', AuthMiddlewares.authorization, OrderMiddlewares.canReadOrder, OrderController.getOrder);
// eslint-disable-next-line max-len
router.post('/:order', AuthMiddlewares.authorization, OrderMiddlewares.canUpdateOrder, OrderController.updateOrder);
// eslint-disable-next-line max-len
router.get('/', AuthMiddlewares.authorization, OrderMiddlewares.canListOrders, OrderController.getAll);

export default router;
