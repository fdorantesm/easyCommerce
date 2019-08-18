import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CategoryController from 'controllers/Category';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
router.post('/:id', validator, CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);
router.post('/', validator, CategoryController.createCategory);

export default router;
