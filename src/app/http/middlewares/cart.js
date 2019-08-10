import ShoppingCart from 'libraries/shoppingCart';

/**
 * Cart middleware class
 */
export default class CartMiddleware {
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
}
