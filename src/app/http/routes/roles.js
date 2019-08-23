import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import RoleController from 'controllers/Role';
import RoleMiddleware from 'middlewares/casbin/roles';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/',
    AuthMiddlewares.authorization,
    RoleMiddleware.canListRoles,
    RoleController.getRoles
);
router.get('/:id',
    AuthMiddlewares.authorization,
    RoleMiddleware.canReadRole,
    RoleController.getRole
);

router.post('/:id',
    AuthMiddlewares.authorization,
    RoleMiddleware.canUpdateRole,
    validator,
    RoleController.updateRole
);

router.delete('/:id',
    AuthMiddlewares.authorization,
    RoleMiddleware.canDeleteRole,
    RoleController.deleteRole
);

router.post('/',
    AuthMiddlewares.authorization,
    RoleMiddleware.canCreateRole,
    validator,
    RoleController.createRole
);

export default router;
