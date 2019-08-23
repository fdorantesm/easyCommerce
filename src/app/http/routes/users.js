import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import UsersMiddlewares from 'middlewares/casbin/users';
import UserController from 'controllers/User';
import UserMiddleware from '../middlewares/casbin/users';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', AuthMiddlewares.authorization, UsersMiddlewares.canListUsers, UserController.getUsers);
router.get('/:id', UserController.getUser);
// router.post('/:id', UserController.updateUser);
// router.delete('/:id', UserController.deleteUser);
router.post('/', AuthMiddlewares.authorization, UsersMiddlewares.canCreateUser, validator, UserController.createUser);
router.post('/:id/roles', AuthMiddlewares.authorization, UsersMiddlewares.canAddUserRole, validator, UserController.assignRole);
router.delete('/:id/roles/:role', AuthMiddlewares.authorization, UsersMiddlewares.canRemoveUserRole, validator, UserController.revokeRole);
router.delete('/:id/roles', AuthMiddlewares.authorization, UsersMiddlewares.canRemoveUserRole, UserController.revokeRoles);
router.get('/:id/roles', AuthMiddlewares.authorization, UserMiddleware.canListUserRole, UserController.getRoles);

export default router;
