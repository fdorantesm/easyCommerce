import merge from 'lodash/merge';
import Product from 'models/Product';
import Upload from 'libraries/upload';
import File from 'models/File';

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
      const options = {
        page: req.query.page || 1,
        populate: req.populate
      };
      // eslint-disable-next-line max-len
      const products = await Product.paginate({deleted: false}, options);
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
      // eslint-disable-next-line max-len
      const product = await Product.findOne({_id: req.params.product, deleted: false}).populate(req.populate);
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
      console.log(req.files);
      console.log('cats', req.body.category);
      // eslint-disable-next-line max-len
      const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
      const uploads = [];
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        files: [],
        // eslint-disable-next-line max-len
        categories: Array.isArray(req.body.category) ? req.body.category : [req.body.category]
      });
      files.map((file) => uploads.push(Upload.file('products', file)));
      Promise.all(uploads).then(async (results) => {
        results.map(async (result) => {
          const file = new File({
            name: result.public_id,
            signature: result.signature,
            format: result.format,
            type: result.resource_type,
            etag: result.etag,
            path: result.secure_url
          });
          product.files.push(file._id);
          await file.save();
        });
        await product.save();
        res.send({
          data: product
        });
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
      console.log('_files', req._files);
      const product = await Product.findById(req.params.product);
      const data = merge(product, req.body);
      req._files.map(async (result) => {
        const file = new File({
          name: result.public_id,
          signature: result.signature,
          format: result.format,
          type: result.resource_type,
          etag: result.etag,
          path: result.secure_url
        });
        data.files.push(file._id);
        await file.save();
      });
      await product.update(data);
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
