import joi, * as type from 'libraries/joi';

const getCartSchema = joi.object().keys({
  key: type.shortString.required()
});

const addProductToCartSchema = joi.object().keys({
  key: type.shortString.required(),
  product: type.objectId.required(),
  qty: type.integerPositive.required()
});

const removeProductFromCartSchema = joi.object().keys({
  key: type.shortString.required(),
  product: type.objectId.required()
});

export default {
  'GET /cart': getCartSchema,
  'POST /cart': addProductToCartSchema,
  'PATCH /cart': removeProductFromCartSchema,
  'DELETE /cart': getCartSchema
};
