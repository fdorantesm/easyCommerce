import joi, * as type from 'libraries/joi';

const createRoleSchema = joi.object().keys({
  name: type.shortString.required()
});

const updateRoleSchema = joi.object().keys({
  name: type.shortString
});

export default {
  'POST /roles': createRoleSchema,
  'POST /roles/:id': updateRoleSchema
};
