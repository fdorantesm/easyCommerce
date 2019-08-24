import casbin from 'libraries/casbin';

/**
 * Order middlewares
 */
class OrderMiddleware {
  /**
   * Grant or deny user access to list orders
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canListOrders(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'order', 'list');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'read orders.'));
    }
  };

  /**
   * Grant or deny user access to read order
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canReadOrder(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'order', 'read');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'read order.'));
    }
  };

  /**
   * Grant or deny user access to update orders
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canUpdateOrder(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'order', 'update');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'update orders.'));
    }
  };

  /**
   * Grant or deny user access to delete orders
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canDeleteOrder(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'order', 'delete');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'delete order.'));
    }
  };

  /**
   * Grant or deny user access to create order
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canCreateOrder(req, res, next) {
    // eslint-disable-next-line max-len
    const permission = await casbin.can(req.user.id, '*', 'order', 'create');
    if (permission.granted) {
      req.permissions = await casbin.getRolePolicies(req.user.id);
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'create orders.'));
    }
  };
}

export default OrderMiddleware;
