/**
 * Auth middleware class
 */
export default class Auth {
  /**
   * Binds token to request if exists
   * @void
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async handshake(req, res, next) {
    // eslint-disable-next-line max-len
    const token = req.headers['authorization'] || req.body.token || req.query.token || null;
    if (token) req.authorization = token;
    next();
  }

  /**
   * Binds authorized user to request
   * @void
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async authorization(req, res, next) {
    next();
  }

  /**
   * Grants or denies access if authenticated
   * @void
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async authenticated(req, res, next) {
    try {
      if (req.user) {
        next();
      } else {
        throw new Error();
      }
    } catch (err) {
      res.boom.unauthorized();
    }
  }
}
