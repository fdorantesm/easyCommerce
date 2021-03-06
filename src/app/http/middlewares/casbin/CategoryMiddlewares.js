import casbin from 'libraries/casbin';

/**
 * Role middlewares
 */
class CategoryMiddlewares {
  /**
   * Grant or deny user access to list categories
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canListCategories(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'category', 'list');
    console.log({permission});
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'read categories.'));
    }
  };

  /**
   * Grant or deny user access to read categories
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canReadCategory(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'category', 'read');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'read categories.'));
    }
  };

  /**
   * Grant or deny user access to update categories
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canUpdateCategory(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'category', 'update');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'update categories.'));
    }
  };

  /**
   * Grant or deny user access to delete categories
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canDeleteCategory(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'category', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'delete categories.'));
    }
  };

  /**
   * Grant or deny user access to create categories
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canCreateCategory(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'category', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'create categories.'));
    }
  };
}

export default CategoryMiddlewares;
