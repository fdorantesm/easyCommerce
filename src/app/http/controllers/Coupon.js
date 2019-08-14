import Coupon from 'models/Coupon';
import moment from 'libraries/moment';
import merge from 'lodash/merge';

/**
 * Coupon Controller
 * @namespace Controllers
 */
class CouponController {
  /**
   * Get Coupons
   * @param {Request} req
   * @param {Response} res
   */
  static async getCoupons(req, res) {
    try {
      const coupons = await Coupon.paginate({}, {page: req.query.page || 1});
      res.send(coupons);
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Create coupon method
   * @param {Request} req
   * @param {Response} res
   */
  static async createCoupon(req, res) {
    try {
      const coupon = new Coupon({
        code: req.body.code,
        from: moment(req.body.from),
        to: moment(req.body.to),
        type: req.body.type,
        value: req.body.value,
        limits: {
          user: req.body.user,
          uses: req.body.uses,
          expiration: req.body.expiration,
          minimumAmount: req.body.min_amount,
          maximumAmount: req.body.max_amount
        },
        public: req.body.public,
        enabled: req.body.enabled
      });
      await coupon.save();
      res.send({
        data: coupon
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Get single coupon
   * @param {Request} req
   * @param {Response} res
   */
  static async getCoupon(req, res) {
    try {
      const coupon = await Coupon.findById(req.params.coupon);
      res.send({
        data: coupon
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Update coupon
   * @param {Request} req
   * @param {Response} res
   */
  static async updateCoupon(req, res) {
    try {
      // eslint-disable-next-line max-len
      const coupon = await Coupon.findById(req.params.coupon);
      const data = merge(coupon, req.body);
      await coupon.update(data);
      res.send({
        data: data
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
}

export default CouponController;
