import merge from 'lodash/merge';
import Product from 'models/Product';
import Upload from 'libraries/upload';
import File from 'models/File';
import casbin from 'libraries/casbin';

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
      const product = await Product.findOne({_id: req.params.id, deleted: false}).populate(req.populate);
      if (product) {
        res.send({
          data: product
        });
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
  /**
   * Get single product
   * @param {Request} req
   * @param {Response} res
   */
  static async createProduct(req, res) {
    try {
      console.log('hmmm')
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        files: [],
        // eslint-disable-next-line max-len
        categories: Array.isArray(req.body.category) ? req.body.category : [req.body.category]
      });
      req._files.map(async (result) => {
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
      await casbin.assignRole(req.user.id, 'owner', `product:${product._id}`);
      await casbin.createPolicy('admin', `product:${product._id}`, 'product', 'read');
      await casbin.createPolicy('admin', `product:${product._id}`, 'product', 'update');
      await casbin.createPolicy('admin', `product:${product._id}`, 'product', 'delete');
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
      const product = await Product.findById(req.params.id);
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
      const product = await Product.findById(req.params.id);
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
  /**
   * Delete product file
   * @param {Request} req
   * @param {Response} res
   */
  static async deleteProductFile(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      const file = await File.findById(req.params.file);
      if (file && product.files.length > 0) {
        for (let i =0; i < product.files.length; i++) {
          // eslint-disable-next-line max-len
          const exists = product.files[i].toString() === req.params.file.toString();
          if (exists) {
            product.files.splice(i, 1);
            const destroy = await Upload.destroy(file.name);
            await product.save();
            if (destroy.result === 'not found') {
              res.boom.notFound(res.__('The %s was not found', 'image'));
            }
            return res.send({
              data: product
            });
          }
        }
      } else {
        res.boom.notFound(res.__('The %s was not found', 'image'));
      }
    } catch (err) {
      console.log(err);
      res.boom.badRequest(err.message);
    }
  }
}

export default ProductController;
