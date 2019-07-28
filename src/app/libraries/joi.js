import joi from 'joi';

export default joi;

export const fullname = joi.string().regex(/^[\W\D\s]+$/i);
export const email = joi.string().email({minDomainAtoms: 2}).lowercase();
export const password = joi.string().min(7).max(30).strict();
export const phone_number = joi.string().regex(/^\+[1-9]{1,4}[0-9]{10,20}/i); // eslint-disable-line
export const tinyString = joi.string().max(24);
export const string = joi.string().max(128);
export const text = joi.string().max(512);
export const decimalPositive = joi.number().positive().precision(2);
export const bool = joi.boolean();
export const integerPositive = joi.number().positive();
export const integer = joi.number();
