import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import CategoryController from 'controllers/Category';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
router.post('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);
router.post('/', CategoryController.createCategory);

export default router;
