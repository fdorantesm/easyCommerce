import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CategoryController from 'controllers/CategoryController';
import CategoryMiddleware from 'middlewares/casbin/categories';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
// eslint-disable-next-line max-len
router.post('/:id', AuthMiddlewares.authorization, validator, CategoryMiddleware.canCreateCategory, CategoryController.updateCategory);
// eslint-disable-next-line max-len
router.delete('/:id', AuthMiddlewares.authorization, CategoryMiddleware.canDeleteCategory, CategoryController.deleteCategory);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, validator, CategoryMiddleware.canCreateCategory, CategoryController.createCategory);

export default router;
