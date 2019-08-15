import Product from 'models/Product';
import merge from 'lodash/merge';

/**
 * Product Class Controller
 */
class ProductController {
  /**
   * Get products
   * @param {Request} req
   * @param {Response} res
   */
  static async getProducts(req, res) {
    try {
      const products = await Product.paginate({deleted: false});
      res.send({
        data: products
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
  /**
   * Get single product
   * @param {Request} req
   * @param {Response} res
   */
  static async getProduct(req, res) {
    try {
      const product = await Product.findOne({_id: req.params.product, deleted: false});
      res.send({
        data: product
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
  /**
   * Get single product
   * @param {Request} req
   * @param {Response} res
   */
  static async createProduct(req, res) {
    try {
      const product = new Product({
        name: req.body.name,
        price: req.body.price
      });
      await product.save();
      res.send({
        data: product
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Update product method
   * @param {Request} req
   * @param {Response} res
   */
  static async updateProduct(req, res) {
    try {
      const product = await Product.findById(req.params.product);
      const data = merge(product, req.body);
      await product.update(data);
      res.send({
        data
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Delete product method
   * @param {Request} req
   * @param {Response} res
   */
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findById(req.params.product);
      if (!product.deleted) {
        await product.softdelete();
        res.send({
          message: res.__('The %s was deleted successfully', 'product')
        });
      } else {
        res.send({
          message: res.__('The %s was not found', 'product')
        });
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
}

export default ProductController;
