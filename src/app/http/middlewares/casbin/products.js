import casbin from 'libraries/casbin';
/**
 * Product middlewares
 * @memberof Middlewares
 */
class ProductMiddlewares {
  /**
   * Grant or deny access to create product
   * @void
   * @memberof Middlewares
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canCreateProduct(req, res, next) {
    const permission = await casbin.can(req.user.id, '*', 'product', 'create');
    if (permission.granted) {
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'create products.'));
    }
  }

  /**
   * Grant or deny access to delete product
   * @void
   * @memberof Middlewares
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canDeleteProduct(req, res, next) {
    const permission = await casbin.can(req.user.id, '*', 'product', 'delete');
    if (permission.granted) {
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'delete products.'));
    }
  }

  /**
   * Grant or deny access to update product
   * @void
   * @memberof Middlewares
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async canUpdateProduct(req, res, next) {
    const permission = await casbin.can(req.user.id, '*', 'product', 'update');
    if (permission.granted) {
      next();
    } else {
      // eslint-disable-next-line max-len
      res.boom.forbidden(res.__(`You don't have permissions to %s`, 'update products.'));
    }
  }
}

export default ProductMiddlewares;
