import joi, * as type from 'libraries/joi';

export const registerSchema = joi.object().keys({
  first_name: type.fullname.required(),
  last_name: type.fullname.required(),
  phone: type.phone_number.required(),
  email: type.email.required(),
  password: type.password.required(),
  // eslint-disable-next-line max-len
  // confirm_password: type.password.valid(joi.ref('password')).required().strict()
});
