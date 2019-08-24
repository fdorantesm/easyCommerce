import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import UsersMiddlewares from 'middlewares/casbin/users';
import UserController from 'controllers/UserController';
import UserMiddleware from '../middlewares/casbin/users';
// eslint-disable-next-line new-cap
const router = Router();

// eslint-disable-next-line max-len
router.get('/', AuthMiddlewares.authorization, UsersMiddlewares.canListUsers, UserController.getUsers);
router.get('/:id', UserController.getUser);
// router.post('/:id', UserController.updateUser);
// router.delete('/:id', UserController.deleteUser);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, UsersMiddlewares.canCreateUser, validator, UserController.createUser);
// eslint-disable-next-line max-len
router.post('/:id/roles', AuthMiddlewares.authorization, UsersMiddlewares.canAddUserRole, validator, UserController.assignRole);
// eslint-disable-next-line max-len
router.delete('/:id/roles/:role', AuthMiddlewares.authorization, UsersMiddlewares.canRemoveUserRole, validator, UserController.revokeRole);
// eslint-disable-next-line max-len
router.delete('/:id/roles', AuthMiddlewares.authorization, UsersMiddlewares.canRemoveUserRole, UserController.revokeRoles);
// eslint-disable-next-line max-len
router.get('/:id/roles', AuthMiddlewares.authorization, UserMiddleware.canListUserRole, UserController.getRoles);

export default router;
