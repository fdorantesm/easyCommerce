import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import UserController from 'controllers/User';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUser);
// router.post('/:id', UserController.updateUser);
// router.delete('/:id', UserController.deleteUser);
router.post('/', validator, UserController.createUser);
router.post('/:id/roles', validator, UserController.assignRole);
router.delete('/:id/roles/:role', validator, UserController.revokeRole);
router.delete('/:id/roles', UserController.revokeRoles);
router.get('/:id/roles', UserController.getRoles);

export default router;
