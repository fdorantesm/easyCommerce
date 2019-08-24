import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CouponController from 'controllers/Coupon';
import CouponPermission from 'middlewares/casbin/coupons';

// eslint-disable-next-line new-cap
const router = Router();

// eslint-disable-next-line max-len
router.get('/', AuthMiddlewares.authorization, CouponPermission.canListCoupons, CouponController.getCoupons);
// eslint-disable-next-line max-len
router.get('/:id', AuthMiddlewares.authorization, CouponPermission.canReadCoupon, CouponController.getCoupon);
// eslint-disable-next-line max-len
router.post('/:id', AuthMiddlewares.authorization, CouponPermission.canUpdateCoupon, validator, CouponController.updateCoupon);
// eslint-disable-next-line max-len
router.delete('/:id', AuthMiddlewares.authorization, CouponPermission.canDeleteCoupon, CouponController.deleteCoupon);
// eslint-disable-next-line max-len
router.post('/', AuthMiddlewares.authorization, CouponPermission.canCreateCoupon, validator, CouponController.createCoupon);

export default router;
