import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import CouponController from 'controllers/Coupon';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CouponController.getCoupons);
router.get('/:coupon', CouponController.getCoupon);
router.post('/:coupon', CouponController.updateCoupon);
router.delete('/:coupon', CouponController.deleteCoupon);
router.post('/', CouponController.createCoupon);

export default router;
