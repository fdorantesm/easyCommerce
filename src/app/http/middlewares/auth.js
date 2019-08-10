import auth from 'libraries/auth';
import User from 'models/User';

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
    const authorization = req.headers['authorization'] || req.body.access_token || req.query.access_token || null;
    if (authorization) {
      req.authorization = authorization.replace('Bearer ', '');
    }
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
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async authentication(req, res, next) {
    try {
      const authorized = await auth.verify(req.authorization);
      if (authorized) {
        // eslint-disable-next-line max-len
        req.user = await User.findById(authorized.sub).populate(['role', 'profile']);
        // await spatie.addUserRoles(req.user.id, req.user.role.name);
        // req.permissions = await spatie.permissions(req.user.id);
        // req.acl = {
        //   user: req.user.id,
        //   role: req.user.role.name,
        //   level: req.user.role.level || 0,
        //   // perms: req.permissions,
        // };
      }
    } catch (e) {
      console.log(e);
      req.acl = {
        role: 'guest',
      };
    } finally {
      next();
    }
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
