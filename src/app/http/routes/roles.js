import Router from 'router';
import AuthMiddlewares from 'middlewares/AuthMiddlewares';
import validator from 'middlewares/validator';
import RoleController from 'controllers/RoleController';
import RoleMiddleware from 'middlewares/casbin/RoleMiddlewares';
// eslint-disable-next-line new-cap
const router = Router();

// eslint-disable-next-line max-len
router.get('/', AuthMiddlewares.authorization, RoleMiddleware.canListRoles, RoleController.getRoles);
// eslint-disable-next-line max-len
router.get('/:id', AuthMiddlewares.authorization, RoleMiddleware.canReadRole, RoleController.getRole);
// eslint-disable-next-line max-len
router.post('/:id', AuthMiddlewares.authorization, RoleMiddleware.canUpdateRole, validator, RoleController.updateRole);
// eslint-disable-next-line max-len
router.delete('/:id', AuthMiddlewares.authorization, RoleMiddleware.canDeleteRole, RoleController.deleteRole);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, RoleMiddleware.canCreateRole, validator, RoleController.createRole);

export default router;
