import trimStart from 'lodash/trimStart'
import trimEnd from 'lodash/trimEnd'
import get from 'lodash/get'
import has from 'lodash/has'
import includes from 'lodash/includes'
import Joi from 'joi'
import Schemas from 'schemas'
import Boom from 'boom'
import methods from 'methods'

// Joi validation options
const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true // remove unknown keys from the validated data
}

export default (req, res, next) => {
  let route
  const path = trimStart((req.route.path !== '/' ? req.route.path : ''), '/')
  route = trimEnd(`${req.baseUrl}/${path}`, '/')

  const key = `${req.method.toUpperCase()} ${route}`

  if (includes(methods, req.method.toLowerCase()) && has(Schemas, key)) {
    // get schema for the current route
    const schema = get(Schemas, key)

    if (schema) {
      // Validate req.body using the schema and validation options
      return Joi.validate(req.body, schema, validationOptions, (err, data) => {
        if (err) {
          // Send back the JSON error response
          const boom = Boom.badData('Invalid request data. Please review request and try again.', err.details)
          next(boom)
        } else {
          // Replace req.body with the data after Joi validation
          req.body = data
          next()
        }
      })
    }
  }

  next()
}

