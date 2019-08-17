import models from 'models';

/**
 * Binds models to request
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export default function(req, res, next) {
  req.models = models;
  next();
}
