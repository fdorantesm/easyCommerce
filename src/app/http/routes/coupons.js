import Router from 'router';
// import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CouponController from 'controllers/Coupon';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/', CouponController.getCoupons);
router.get('/:id', CouponController.getCoupon);
router.post('/:id', validator, CouponController.updateCoupon);
router.delete('/:id', CouponController.deleteCoupon);
router.post('/', validator, CouponController.createCoupon);

export default router;
