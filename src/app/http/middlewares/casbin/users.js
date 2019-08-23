import casbin from 'libraries/casbin';

/**
 * Role middlewares
 */
class UserMiddleware {
  /**
   * Grant or deny user access to list users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canListUsers(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user', 'list');
    console.log({permission});
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
   * Grant or deny user access to read users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canReadUser(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user', 'read');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
   * Grant or deny user access to update users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canUpdateUser(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user', 'update');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
   * Grant or deny user access to delete users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canDeleteUser(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
   * Grant or deny user access to create users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canCreateUser(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
   * Grant or deny user access to create users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canAddUserRole(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user.roles', 'create');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
   * Grant or deny user access to create users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canRemoveUserRole(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user.roles', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };

  /**
   * Grant or deny user access to create users
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canListUserRole(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'user.roles', 'read');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      res.boom.forbidden();
    }
  };
}

export default UserMiddleware;
