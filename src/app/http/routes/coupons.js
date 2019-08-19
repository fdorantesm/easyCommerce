import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CouponController from 'controllers/Coupon';
import {canAccessToAdmin, canListCoupons} from 'middlewares/casbin/admin';
// import  from 'middlewares/casbin/customer';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/',
    AuthMiddlewares.authorization,
    canAccessToAdmin,
    canListCoupons,
    CouponController.getCoupons
);
router.get('/:id', CouponController.getCoupon);
router.post('/:id', validator, CouponController.updateCoupon);
router.delete('/:id', CouponController.deleteCoupon);
router.post('/', validator, CouponController.createCoupon);

export default router;
