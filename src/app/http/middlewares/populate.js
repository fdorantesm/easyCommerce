import deepPopulate from 'deep-populate';

/**
 * Bind populate to request
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export default function populate(req, res, next) {
  if (req.query.with) {
    req.populate = deepPopulate(req.query.with);
  }
  next();
};
