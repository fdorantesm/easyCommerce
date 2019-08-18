import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CouponController from 'controllers/Coupon';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CouponController.getCoupons);
router.get('/:coupon', CouponController.getCoupon);
router.post('/:coupon', validator, CouponController.updateCoupon);
router.delete('/:coupon', CouponController.deleteCoupon);
router.post('/', validator, CouponController.createCoupon);

export default router;
