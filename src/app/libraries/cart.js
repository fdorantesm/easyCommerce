/**
 * Cart Library
 * @description Handles Shopping cart actions and content
 * @namespace libraries
 */
export default class Cart {
  /**
   * Constructor Method
   * @param {Object} options
   */
  constructor(options = {}) {
    if (options.key) {
      this._key = options.key;
    }
    this._tax = options.tax || 16;
    this._type = options.type || 'default';
    this._products = [];
  }

  /**
   * Add product
   * @param {Object} product
   * @param {Integer} qty
   * @return {Array<Product>}
   */
  async addProduct(product, qty) {
    if (!Object.prototype.hasOwnProperty.call(product, 'id')) {
      throw new Error('CartProductMissingIdException');
    }
    if (!Object.prototype.hasOwnProperty.call(product, 'price')) {
      throw new Error('CartProductMissingPriceException');
    }
    if (!Object.prototype.hasOwnProperty.call(product, 'name')) {
      throw new Error('CartProductMissingNameException');
    }
    if (parseInt(qty) < 1) {
      throw new Error('CartProductQuantityException');
    }
    product.price = parseFloat(Number(product.price).toFixed(2));
    return this._products.push({...product, qty});
  }

  /**
   * Increase product qty
   * @void This function doesn't return a vualue
   * @param {Object} product Product must to have 'id' key
   * @param {Integer} qty This number must be an integer positive value
   */
  async increaseProduct(product, qty) {
    if (parseInt(qty) > 0) {
      // eslint-disable-next-line max-len
      const index = this._products.findIndex((item) => item.id.toString() === product.id.toString());
      if (index > -1) {
        this._products[index].qty += parseInt(qty);
        console.log(this._products[index].qty);
      } else {
        throw new Error('CartProductDoesntExistsException');
      }
    } else {
      throw new Error('CartProductQuantityException');
    }
  }

  /**
   * Increase product qty
   * @void This function doesn't return a vualue
   * @param {Object} product Product must to have 'id' key
   * @param {Integer} qty This number must be an integer positive value
   */
  async decreaseProduct(product, qty) {
    if (parseInt(qty) > 0) {
      const index = this._products.findIndex((item) => item.id === product.id);
      if (index > -1) {
        this._products[index].qty -= parseInt(qty);
        if (this._products[index].qty <= 0) {
          // eslint-disable-next-line max-len
          this._products = this._products.filter((item) => item.id !== parseInt(product.id));
        }
      } else {
        throw new Error('CartProductDoesntExistsException');
      }
    } else {
      throw new Error('CartProductQuantityException');
    }
  }

  /**
   * Remove product from cart
   * @param {Integer} id
   * @return {Array<Product>}
   */
  async removeProduct(id) {
    // eslint-disable-next-line max-len
    this._products = this._products.filter((product) => product.id.toString() !== id.toString());
    return this;
  }

  /**
   * Clear cart
   * @return {Cart}
   */
  async clear() {
    this._products = [];
    return this;
  }

  /**
   * Return cart in JSON format
   * @return {Object}
   */
  json() {
    return {
      key: this._key,
      products: this._products,
      type: this._type,
      tax: this._tax,
      total: this.total,
      grandTotal: this.grandTotal,
      items: this.items,
    };
  }

  /**
   * Cart type setter
   * @param {String} type
   * @void
   */
  set type(type) {
    this._type = type;
  }

  /**
   * Set cart key
   * @param {String} key
   * @void
   */
  set key(key) {
    this._key = key;
  }

  /**
   * Set taxes
   * @void
   * @param {Integer} tax
   */
  set tax(tax) {
    this._tax = tax;
  }

  /**
   * Get tax percentage
   * @void
   */
  get tax() {
    return this._tax;
  }

  /**
   * Get total products amount
   * @return {Number}
   */
  get total() {
    return this._products.reduce((sum, curr) => {
      return sum + (curr.price * curr.qty);
    }, 0);
  }

  /**
   * Get grand total amount
   * @return {Number}
   */
  get grandTotal() {
    return this._products.reduce((sum, curr) => {
      // eslint-disable-next-line max-len
      return parseFloat((sum + ((curr.price * (1 + ((curr.tax || this._tax) / 100))) * curr.qty)).toFixed(2));
    }, 0);
  }

  /**
   * Get total items
   * @return {Integer}
   */
  get items() {
    return this._products.reduce((sum, curr) => {
      return sum + curr.qty;
    }, 0);
  }

  /**
   * Get cart content
   * @return {Array<Product>}
   */
  get content() {
    return this._products;
  }
}
