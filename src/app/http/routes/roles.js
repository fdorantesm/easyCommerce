import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import RoleController from 'controllers/Role';
import {canAccessToAdmin} from 'middlewares/casbin/admin';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', canAccessToAdmin, RoleController.getRoles);
router.get('/:id', canAccessToAdmin, RoleController.getRole);
router.post('/:id', canAccessToAdmin, validator, RoleController.updateRole);
router.delete('/:id', canAccessToAdmin, RoleController.deleteRole);
router.post('/', canAccessToAdmin, validator, RoleController.createRole);

export default router;
