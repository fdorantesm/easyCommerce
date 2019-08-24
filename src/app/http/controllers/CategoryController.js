import Category from 'models/Category';
import merge from 'lodash/merge';
import {slug} from 'helpers/common';
import casbin from 'libraries/casbin';

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
      const options = {
        page: req.query.page || 1,
        populate: req.populate
      };
      const categories = await Category.paginate({deleted: false}, options);
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
        slug: slug(req.body.name),
        parent: req.body.parent || null,
        order: req.body.order
      });
      await category.save();
      await casbin.createPolicy('admin', `category:${category._id}`, 'category', 'read');
      await casbin.createPolicy('admin', `category:${category._id}`, 'category', 'update');
      await casbin.createPolicy('admin', `category:${category._id}`, 'category', 'delete');
      res.send({
        data: category
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      if (err.errors.name && err.errors.name.message === 'CategoryAlreadyExistsException') {
        res.boom.badData(res.__('%s already exists', 'Category'));
      } else if (err.message === 'ValidationError') {
        res.boom.badData(res.__('Please check all form fields and try again'));
      } else {
        // eslint-disable-next-line max-len
        res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
      }
    }
  }

  /**
   * Get single category
   * @param {Request} req
   * @param {Response} res
   */
  static async getCategory(req, res) {
    try {
      // eslint-disable-next-line max-len
      const category = await Category.findById(req.params.id).populate(req.populate);
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
        const data = merge(category, {
          name: req.body.name,
        });
        if (req.body.name) {
          data.slug = slug(req.body.name);
        }
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
