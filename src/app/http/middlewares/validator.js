import trimStart from 'lodash/trimStart';
import trimEnd from 'lodash/trimEnd';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import Joi from 'joi';
import Schemas from 'schemas';
import methods from 'methods';

// Joi validation options
const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true, // remove unknown keys from the validated data
};

/**
 * Schema request validator
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @return {Function} returns Joi validation
 */
export default (req, res, next) => {
  const path = trimStart((req.route.path !== '/' ? req.route.path : ''), '/');
  const route = trimEnd(`${req.baseUrl}/${path}`, '/');

  const key = `${req.method.toUpperCase()} ${route}`;

  if (includes(methods, req.method.toLowerCase()) && has(Schemas, key)) {
    const schema = get(Schemas, key);
    if (schema) {
      return Joi.validate(req.body, schema, validationOptions, (err, data) => {
        if (err) {
          // eslint-disable-next-line max-len
          return res.boom.badData('Invalid request data. Please review request and try again.', {errors: err.details});
        } else {
          req.body = data;
          next();
        }
      });
    }
  }
  next();
};
