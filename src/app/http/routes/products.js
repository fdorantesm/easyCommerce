import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import upload from 'middlewares/upload';
import ProductController from 'controllers/ProductController';
import ProductMiddlewares from 'middlewares/casbin/products';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProduct);
// eslint-disable-next-line max-len
router.post('/:id', AuthMiddlewares.authorization, ProductMiddlewares.canUpdateProduct, validator, upload, ProductController.updateProduct);
// eslint-disable-next-line max-len
router.delete('/:id', AuthMiddlewares.authorization, ProductMiddlewares.canDeleteProduct, ProductController.deleteProduct);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, ProductMiddlewares.canCreateProduct, validator, upload, ProductController.createProduct);
// eslint-disable-next-line max-len
router.delete('/:id/:file', AuthMiddlewares.authorization, ProductMiddlewares.canUpdateProduct, ProductController.deleteProductFile);

export default router;
