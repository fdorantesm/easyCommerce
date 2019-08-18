import joi, * as type from 'libraries/joi';

export const createOrder = joi.object().keys({
  cart_key: type.shortString.required(),
  method: type.paymentMethods.required(),
  token: type.conektaToken,
  from_latitude: type.decimal.required(),
  from_longitude: type.decimal.required(),
  to_latitude: type.decimal.required(),
  to_longitude: type.decimal.required(),
  from_address_line1: type.shortString.required(),
  from_address_line2: type.shortString,
  from_address_line3: type.shortString.required(),
  from_address_city: type.shortString.required(),
  from_address_state: type.shortString.required(),
  from_address_country: type.tinyString.required(),
  from_address_references: type.shortString.required(),
  from_address_between_streets: type.shortString,
  from_address_zip: type.tinyString.required(),
  from_sender_name: type.fullname.required(),
  from_sender_phone: type.phone.required(),
  to_address_line1: type.shortString.required(),
  to_address_line2: type.shortString,
  to_address_line3: type.shortString.required(),
  to_address_references: type.shortString.required(),
  to_address_between_streets: type.shortString,
  to_address_city: type.shortString.required(),
  to_address_state: type.shortString.required(),
  to_address_country: type.tinyString.required(),
  to_address_zip: type.tinyString.required(),
  to_receiver_name: type.fullname.required(),
  to_receiver_phone: type.phone.required(),
  shipping_type: type.tinyString,
  shipping_secured: type.bool,
  bill: type.bool,
  gift: type.bool
});

export default {
  'POST /orders': createOrder
};
