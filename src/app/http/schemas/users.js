import joi, * as type from 'libraries/joi';

const assignRoleSchema = joi.object().keys({
  role: type.shortString.required(),
  domain: type.shortString.required()
});

const revokeRoleSchema = joi.object().keys({
  domain: type.shortString.required()
});

const revokeRolesSchema = joi.object().keys({
  domain: type.shortString.required()
});

const createUserSchema = joi.object().keys({
  first_name: type.fullname.required(),
  last_name: type.fullname.required(),
  email: type.email.required(),
  phone: type.phone.required(),
  password: type.password.required(),
  role: type.shortString.required()
});

export default {
  'POST /users/:id/roles': assignRoleSchema,
  'DELETE /users/:id/roles/:role': revokeRoleSchema,
  'DELETE /users/:id/roles': revokeRolesSchema,
  'POST /users': createUserSchema
};
