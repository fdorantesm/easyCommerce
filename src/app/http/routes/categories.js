import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import {canCreateCategories} from 'middlewares/casbin/admin';
import CategoryController from 'controllers/Category';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
router.post('/:id', validator, CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);
router.post('/',
    AuthMiddlewares.authorization,
    validator,
    canCreateCategories,
    CategoryController.createCategory
);

export default router;
