import ShoppingCart from 'libraries/shoppingCart';

/**
 * Cart middleware class
 */
export default class CartMiddlewares {
  /**
   * Bind cart to request
   * @void
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async bindCart(req, res, next) {
    try {
      const cart = new ShoppingCart({key: req.body.cart_key});
      await cart.restore();
      req.cart = cart;
      next();
    } catch {
      res.boom.badData(req.__(`The cart couldn't be retrieved`));
    }
  }

  /**
   * Total escenaries
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateTotal(req, res, next) {
    // Get cart from request
    const cart = req.cart;

    if (cart.content.length === 0) {
      return res.boom.conflict(res.__('The cart is empty'));
    }

    if (cart.total > 10000 && req.body.method === 'oxxo') {
      // eslint-disable-next-line max-len
      return res.boom.conflict(res.__('The maximum cash amount is $10,000 pesos, try again using SPEI method.'));
    }

    if (cart.total > 5000 && req.body.method === 'card') {
      // eslint-disable-next-line max-len
      return res.boom.conflict(res.__('The maximum card amount is $5,000 pesos, try again using SPEI method.'));
    }

    if (cart.total > 9999999 && req.body.method === 'spei') {
      // eslint-disable-next-line max-len
      return res.boom.conflict(res.__(`The maximum SPEI amount is $9'999,999 pesos.`));
    }

    // Yay
    next();
  }
}
