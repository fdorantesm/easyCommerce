import joi, * as type from 'libraries/joi';

const createProductSchema = joi.object().keys({
  name: type.shortString.required(),
  price: type.integerPositive.required(),
  file: type.arrayOrSingleFile.required(),
  category: type.arrayOrSingleObjectId.required()
});

const updateProductSchema = joi.object().keys({
  name: type.shortString,
  price: type.integerPositive,
  file: type.arrayOrSingleFile,
  category: type.arrayOrSingleObjectId
});

export default {
  'POST /products': createProductSchema,
  'POST /products/:product': updateProductSchema
};
