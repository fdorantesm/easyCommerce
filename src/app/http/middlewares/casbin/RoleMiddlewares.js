import casbin from 'libraries/casbin';

/**
 * Role middlewares
 */
class RoleMiddlewares {
  /**
   * Grant or deny user access to list roles
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canListRoles(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'role', 'list');
    console.log({permission});
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'read roles.'));
    }
  };

  /**
   * Grant or deny user access to read roles
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canReadRole(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'role', 'read');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'read roles.'));
    }
  };

  /**
   * Grant or deny user access to update roles
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canUpdateRole(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'role', 'update');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'update roles.'));
    }
  };

  /**
   * Grant or deny user access to delete roles
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canDeleteRole(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'role', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'delete roles.'));
    }
  };

  /**
   * Grant or deny user access to create roles
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canCreateRole(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'role', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'create roles.'));
    }
  };
}

export default RoleMiddlewares;
