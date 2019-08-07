/* eslint-disable no-useless-constructor */
import ShoppingCart from 'libraries/cart';
import Cart from 'models/Cart';

/**
 * Sequelize driver to store cart content into DB
 */
export default class MongoShoppingCart extends ShoppingCart {
  /**
   * Constructor method
   * @param {Object} options
   * @example
   * const Cart = new Cart({
   *  key: 'myKey', // String
   *  tax: 16 // Percentage
   * })
   */
  constructor(options) {
    super(options);
  }

  /**
   * Add product to cart
   * @param {Object} newProduct
   * @param {Integer} qty This number must be an integer positive value
   */
  async addProduct(newProduct, qty) {
    // eslint-disable-next-line max-len
    try {
      if (parseInt(qty) > 0) {
        // eslint-disable-next-line max-len
        if (this._products.findIndex((product) => product.id.toString() === newProduct.id.toString()) === -1) {
          await super.addProduct(newProduct, parseInt(qty));
        } else {
          await super.increaseProduct(newProduct, qty);
        }
      } else {
        throw new Error('CartProductQuantityException');
      }
    } catch (err) {
      throw new Error('CartProductMissingProductException');
    }
  }

  /**
   * Remove product from cart
   * @param {ObjectId} id
   */
  async removeProduct(id) {
    super.removeProduct(id);
    return this;
  }

  /**
   * Clear cart content
   */
  async clear() {
    return super.clear() && this.store();
  }

  /**
   * Delete cart
   */
  async delete() {
    if (!this._key) {
      throw new Error('MissingCartKeyException');
    } else {
      try {
        const cart = await Cart.findOne({key: this._key});
        if (cart) {
          Cart.deleteOne({key: this._key});
        } else {
          throw new Error('CartNotFoundException');
        }
      } catch (err) {
        throw err;
      }
    }
  }

  /**
   * Restore content from DB
   */
  async restore() {
    if (!this._key) {
      throw new Error('MissingCartKeyException');
    }
    const cart = await Cart.findOrCreate({key: this._key});
    this._type = cart.doc.type;
    this._products = cart.doc.products;
    return this._products;
  }

  /**
   * Store content to DB
   */
  async store() {
    if (!this._key) {
      throw new Error('MissingCartKeyException');
    } else {
      const cart = await Cart.findOne({key: this._key});
      const data = {
        type: this._type,
        products: this._products
      };
      if (cart) {
        return Cart.update({key: this._key}, data);
      } else {
        return new Cart({
          key: this._key,
          ...data
        });
      }
    }
  }
}
