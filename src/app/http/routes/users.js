import Router from 'router';
import AuthMiddlewares from 'middlewares/AuthMiddlewares';
import validator from 'middlewares/validator';
import UserMiddlewares from 'middlewares/casbin/UserMiddlewares';
import UserController from 'controllers/UserController';
// eslint-disable-next-line new-cap
const router = Router();

// eslint-disable-next-line max-len
router.get('/', AuthMiddlewares.authorization, UserMiddlewares.canListUsers, UserController.getUsers);
router.get('/:id', UserController.getUser);
// router.post('/:id', UserController.updateUser);
// router.delete('/:id', UserController.deleteUser);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, UserMiddlewares.canCreateUser, validator, UserController.createUser);
// eslint-disable-next-line max-len
router.post('/:id/roles', AuthMiddlewares.authorization, UserMiddlewares.canAddUserRole, validator, UserController.assignRole);
// eslint-disable-next-line max-len
router.delete('/:id/roles/:role', AuthMiddlewares.authorization, UserMiddlewares.canRemoveUserRole, validator, UserController.revokeRole);
// eslint-disable-next-line max-len
router.delete('/:id/roles', AuthMiddlewares.authorization, UserMiddlewares.canRemoveUserRole, UserController.revokeRoles);
// eslint-disable-next-line max-len
router.get('/:id/roles', AuthMiddlewares.authorization, UserMiddlewares.canListUserRole, UserController.getRoles);

export default router;
