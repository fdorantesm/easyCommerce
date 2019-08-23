import Router from 'router';
import AuthMiddlewares from 'middlewares/auth';
import validator from 'middlewares/validator';
import CouponController from 'controllers/Coupon';
import {canAccessToAdmin} from 'middlewares/casbin/admin';
import CouponPermission from 'middlewares/casbin/coupons';
// import  from 'middlewares/casbin/customer';
// eslint-disable-next-line new-cap
const router = Router();

router.get('/',
    AuthMiddlewares.authorization,
    canAccessToAdmin,
    CouponPermission.canListCoupons,
    CouponController.getCoupons
);
router.get('/:id',
    AuthMiddlewares.authorization,
    CouponPermission.canReadCoupon,
    CouponController.getCoupon
);

router.post('/:id',
    AuthMiddlewares.authorization,
    validator,
    CouponPermission.canUpdateCoupon,
    CouponController.updateCoupon
);
router.delete('/:id',
    AuthMiddlewares.authorization,
    CouponPermission.canDeleteCoupon,
    CouponController.deleteCoupon
);
router.post('/',
    AuthMiddlewares.authorization,
    validator,
    CouponPermission.canCreateCoupon,
    CouponController.createCoupon
);

export default router;
