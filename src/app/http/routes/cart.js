import Router from 'router';
import CartController from 'controllers/Cart';
// import CartMiddlewares from 'middlewares/cart';
import validator from 'middlewares/validator';
// eslint-disable-next-line new-cap
const router = Router();

router.route('/')
    .get(validator, CartController.getCart)
    .post(validator, CartController.addProduct)
    .delete(validator, CartController.clearCart)
    .patch(validator, CartController.deleteProduct);

export default router;
