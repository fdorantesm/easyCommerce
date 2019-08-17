import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import UserController from 'controllers/User';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUser);
// router.post('/:id', UserController.updateUser);
// router.delete('/:id', UserController.deleteUser);
router.post('/', UserController.createUser);
router.post('/:id/roles', UserController.assignRole);
router.delete('/:id/roles/:role', UserController.revokeRole);
router.delete('/:id/roles', UserController.revokeRoles);
router.get('/:id/roles', UserController.getRoles);

export default router;
