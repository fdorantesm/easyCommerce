import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import upload from 'middlewares/upload';
import ProductController from 'controllers/Product';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:product', ProductController.getProduct);
router.post('/:product', validator, upload, ProductController.updateProduct);
router.delete('/:product', ProductController.deleteProduct);
router.post('/', validator, upload, ProductController.createProduct);
router.delete('/:product/:file', ProductController.deleteProductFile);

export default router;
