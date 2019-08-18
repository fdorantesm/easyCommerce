import joi, * as type from 'libraries/joi';

const createCouponSchema = joi.object().keys({
  public: type.bool,
  code: type.tinyString.required(),
  from: type.date,
  to: type.date,
  type: type.couponType.required(),
  value: type.integerPositive.required(),
  enabled: type.bool,
  user: type.integerPositive,
  uses: type.integerPositive,
  expiration: type.integerPositive,
  min_amount: type.integerPositive,
  max_amount: type.integerPositive
});

const updateCouponSchema = joi.object().keys({
  public: type.bool,
  code: type.tinyString,
  from: type.date,
  to: type.date,
  type: type.couponType,
  value: type.integerPositive,
  enabled: type.bool,
  user: type.integerPositive,
  uses: type.integerPositive,
  expiration: type.integerPositive,
  min_amount: type.integerPositive,
  max_amount: type.integerPositive
});

export default {
  'POST /coupons/': createCouponSchema,
  'POST /coupons/:coupon': updateCouponSchema,
};
