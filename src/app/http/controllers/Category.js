import Category from 'models/Category';
import moment from 'libraries/moment';
import merge from 'lodash/merge';

/**
 * Category Controller
 * @namespace Controllers
 */
class CategoryController {
  /**
   * Get Coupons
   * @param {Request} req
   * @param {Response} res
   */
  static async getCategories(req, res) {
    try {
      // eslint-disable-next-line max-len
      const categories = await Category.paginate({deleted: false}, {page: req.query.page || 1});
      res.send(categories);
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Create category method
   * @param {Request} req
   * @param {Response} res
   */
  static async createCategory(req, res) {
    try {
      const category = new Category({
        name: req.body.name,
        slug: req.body.slug,
        parent: req.body.parent || null,
        order: req.body.order
      });
      await category.save();
      res.send({
        data: category
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Get single category
   * @param {Request} req
   * @param {Response} res
   */
  static async getCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      res.send({
        data: category
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Update category
   * @param {Request} req
   * @param {Response} res
   */
  static async updateCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (category) {
          const data = merge(category, req.body);
          await category.update(data);
          res.send({
            data: data
          });
      } else {
        res.status(404).send({
          message: res.__('The %s was not found', 'category')
        });
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
  /**
   * Delete category method
   * @param {Request} req
   * @param {Response} res
   */
  static async deleteCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (category && !category.deleted) {
        category.softdelete();
        res.send({
          message: res.__('The %s was deleted successfully', 'category')
        });
      } else {
        res.status(404).send({
          message: res.__('The %s was not found', 'category')
        });
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
}

export default CategoryController;
