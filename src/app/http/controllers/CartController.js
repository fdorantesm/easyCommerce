import ShoppingCart from 'libraries/shoppingCart';
import Product from 'models/Product';

/**
 * Cart Controller
 * @class
 * @hideconstructor
 * @description Handles shopping cart events like add products,
 * remove products, clear cart, create and retrieve cart.
 */
class CartController {
  /**
   * Get cart
   * @param {Request} req
   * @param {Response} res
   */
  static async getCart(req, res) {
    try {
      const cart = new ShoppingCart({key: req.query.key});
      await cart.restore();
      res.send(cart.json());
    } catch (err) {
      res.status(400).send(err);
    }
  }
  /**
   * Add product
   * @module CartController
   * @function
   * @param {e.Request} req
   * @param {e.Response} res
   * @return {undefined}
   */
  static async addProduct(req, res) {
    try {
      const cart = new ShoppingCart({key: req.body.key});
      await cart.restore();
      const product = await Product.findById(req.body.product).populate(['files', 'categories']);
      console.log(product)
      await cart.addProduct({
        id: product._id,
        price: product.price,
        name: product.name,
        files: product.files,
        categories: product.categories,
        sku: product.sku
      }, req.body.qty);
      await cart.store();
      res.send(cart.json());
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  }

  /**
   * Clear product
   * @param {Request} req
   * @param {Response} res
   */
  static async clearCart(req, res) {
    try {
      const cart = new ShoppingCart({key: req.body.key});
      await cart.restore();
      await cart.clear();
      await cart.store();
      res.send(cart.json());
    } catch (err) {
      res.status(400).send(err);
    }
  }

  /**
   * Delete product
   * @param {Request} req
   * @param {Response} res
   */
  static async deleteProduct(req, res) {
    try {
      const cart = new ShoppingCart({key: req.body.key});
      await cart.restore();
      const product = await Product.findById(req.body.product);
      if (product) {
        await cart.removeProduct(product._id);
        await cart.store();
        res.send(cart.json());
      } else {
        throw new Error('NotFoundException');
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      if (err.message === 'NotFoundException') {
        res.boom.notFound(res.__('The %s was not found', 'product'));
      } else {
        res.boom.badRequest(res.__(err.message));
      }
    }
  }
}

export default CartController;
