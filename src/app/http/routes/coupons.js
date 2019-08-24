import Router from 'router';
import AuthMiddlewares from 'middlewares/AuthMiddlewares';
import validator from 'middlewares/validator';
import CouponController from 'controllers/CouponController';
import CouponMiddlewares from 'middlewares/casbin/CouponMiddlewares';

// eslint-disable-next-line new-cap
const router = Router();

// eslint-disable-next-line max-len
router.get('/', AuthMiddlewares.authorization, CouponMiddlewares.canListCoupons, CouponController.getCoupons);
// eslint-disable-next-line max-len
router.get('/:id', AuthMiddlewares.authorization, CouponMiddlewares.canReadCoupon, CouponController.getCoupon);
// eslint-disable-next-line max-len
router.post('/:id', AuthMiddlewares.authorization, CouponMiddlewares.canUpdateCoupon, validator, CouponController.updateCoupon);
// eslint-disable-next-line max-len
router.delete('/:id', AuthMiddlewares.authorization, CouponMiddlewares.canDeleteCoupon, CouponController.deleteCoupon);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, CouponMiddlewares.canCreateCoupon, validator, CouponController.createCoupon);

export default router;
