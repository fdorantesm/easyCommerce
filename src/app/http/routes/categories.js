import Router from 'router';
import AuthMiddlewares from 'middlewares/AuthMiddlewares';
import validator from 'middlewares/validator';
import CategoryController from 'controllers/CategoryController';
import CategoryMiddlewares from 'middlewares/casbin/CategoryMiddlewares';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
// eslint-disable-next-line max-len
router.post('/:id', AuthMiddlewares.authorization, validator, CategoryMiddlewares.canCreateCategory, CategoryController.updateCategory);
// eslint-disable-next-line max-len
router.delete('/:id', AuthMiddlewares.authorization, CategoryMiddlewares.canDeleteCategory, CategoryController.deleteCategory);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, validator, CategoryMiddlewares.canCreateCategory, CategoryController.createCategory);

export default router;
