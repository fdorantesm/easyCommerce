import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import RoleController from 'controllers/Role';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', RoleController.getRoles);
router.get('/:id', RoleController.getRole);
router.post('/:id', validator, RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);
router.post('/', validator, RoleController.createRole);

export default router;
