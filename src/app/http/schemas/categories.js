import joi, * as type from 'libraries/joi';

const createCategorySchema = joi.object().keys({
  name: type.shortString.required(),
  parent: type.objectId
});

const updateCategorySchema = joi.object().keys({
  name: type.shortString,
  parent: type.objectId
});

export default {
  'POST /categories': createCategorySchema,
  'POST /categories/:id': updateCategorySchema
};
