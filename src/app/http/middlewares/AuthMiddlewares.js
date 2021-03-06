import auth from 'libraries/auth';
import User from 'models/User';

/**
 * Auth middleware class
 */
export default class AuthMiddleware {
  /**
   * Binds token to request if exists
   * @void
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async handshake(req, res, next) {
    // eslint-disable-next-line max-len
    const authorization = req.headers['authorization'] || req.body.access_token || req.query.access_token || null;
    if (authorization) {
      req.authorization = authorization.replace('Bearer ', '');
    }
    next();
  }

  /**
   * Binds user to request
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async authentication(req, res, next) {
    try {
      const authorized = await auth.verify(req.authorization);
      if (authorized) {
        // eslint-disable-next-line max-len
        req.user = await User.findById(authorized.sub).populate(['roles', 'profile']);
      }
    } catch (err) {
      console.log(err);
      req.acl = {
        role: 'guest',
      };
    } finally {
      next();
    }
  }

  /**
   * Grants access to next middleware if user is
   * authenticated
   * @void
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async authorization(req, res, next) {
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
