import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CategoryController from 'controllers/Category';
import CategoryMiddleware from 'middlewares/casbin/categories';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/',
    CategoryController.getCategories
);

router.get('/:id',
    CategoryController.getCategory
);

router.post('/:id',
    AuthMiddlewares.authorization,
    validator,
    CategoryMiddleware.canCreateCategory,
    CategoryController.updateCategory
);

router.delete('/:id',
    AuthMiddlewares.authorization,
    CategoryMiddleware.canDeleteCategory,
    CategoryController.deleteCategory
);

router.post('/',
    AuthMiddlewares.authorization,
    validator,
    CategoryMiddleware.canCreateCategory,
    CategoryController.createCategory
);

export default router;
