import Router from 'router';
import CartController from 'controllers/Cart';

// eslint-disable-next-line new-cap
const router = Router();

router.route('/')
    .get(CartController.getCart)
    .post(CartController.addProduct)
    .delete(CartController.clearCart)
    .patch(CartController.deleteProduct);

export default router;
