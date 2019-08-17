import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import RoleController from 'controllers/Role';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', RoleController.getRoles);
router.get('/:id', RoleController.getRole);
router.post('/:id', RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);
router.post('/', RoleController.createRole);

export default router;
