import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import ProductController from 'controllers/Product';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:product', ProductController.getProduct);
router.post('/:product', ProductController.updateProduct);
router.delete('/:product', ProductController.deleteProduct);
router.post('/', ProductController.createProduct);

export default router;
