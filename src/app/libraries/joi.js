const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

export default joi;
export const fullname = joi.string().regex(/^[\W\D\s]+$/i);
export const email = joi.string().email({minDomainSegments: 2}).lowercase();
export const password = joi.string().min(7).max(30).strict();
// eslint-disable-next-line max-len
export const phone = joi.string().regex(/^\+[1-9]{1,4}[0-9]{10,20}/i);
export const tinyString = joi.string().max(24);
export const shortString = joi.string().max(64);
export const string = joi.string().max(128);
export const text = joi.string().max(512);
export const decimal = joi.number().precision(16);
export const decimalPositive = joi.number().positive().precision(2);
export const bool = joi.boolean();
export const integerPositive = joi.number().positive();
export const integer = joi.number();
// eslint-disable-next-line max-len
export const objectId = joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
export const object = joi.object();
export const populate = joi.string().regex(/(.+?)(?:,\|$)/);
export const paymentMethods = joi.string().valid('oxxo', 'card', 'spei');
export const conektaToken = joi.string().regex(/tok_[\w+]/i);
export const countryISO = joi.string().length(2);
export const date = joi.date().format('YYYY-MM-DD');
export const couponType = joi.string().valid('amount', 'percentage');
export const binary = joi.binary();
export const array = joi.array();
// eslint-disable-next-line max-len
export const arrayOrSingleObjectId = joi.alternatives().try(joi.array().items(objectId), objectId);
// eslint-disable-next-line max-len
export const arrayOrSingleFile = joi.alternatives().try(array.items(object), object);
