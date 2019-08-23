import casbin from 'libraries/casbin';

/**
 * Coupon middlewares
 */
class CouponMiddleware {
  /**
   * Grant or deny user access to list coupons
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canListCoupons(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'coupon', 'list');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
     * Grant or deny user access to read coupons
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     */
  static async canReadCoupon(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'coupon', 'read');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
     * Grant or deny user access to update coupons
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     */
  static async canUpdateCoupon(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'coupon', 'update');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
     * Grant or deny user access to delete coupons
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     */
  static async canDeleteCoupon(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'coupon', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
     * Grant or deny user access to create coupons
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     */
  static async canCreateCoupon(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'coupon', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };
}

export default CouponMiddleware;
