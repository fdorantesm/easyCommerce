import Role from 'models/Role';
import merge from 'lodash/merge';

/**
 * Category Controller
 * @namespace Controllers
 */
class RoleController {
  /**
   * Get Coupons
   * @param {Request} req
   * @param {Response} res
   */
  static async getRoles(req, res) {
    try {
      const options = {
        page: req.query.page || 1,
        populate: req.populate
      };
      const roles = await Role.paginate({deleted: false}, options);
      res.send(roles);
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Create role method
   * @param {Request} req
   * @param {Response} res
   */
  static async createRole(req, res) {
    try {
      const role = new Role({
        name: req.body.name,
        slug: req.body.slug,
        parent: req.body.parent || null,
        order: req.body.order
      });
      await role.save();
      await casbin.createPolicy('admin', `role:${role._id}`, 'role', 'read');
      await casbin.createPolicy('admin', `role:${role._id}`, 'role', 'update');
      await casbin.createPolicy('admin', `role:${role._id}`, 'role', 'delete');
      res.send({
        data: role
      });
    } catch (err) {
      // eslint-disable-next-line max-len
      if ('name' in err.errors && err.errors.name.message === 'RoleAlreadyExistsException') {
        res.boom.badData(res.__('%s already exists', 'Role'));
      } else if (err.name === 'ValidationError') {
        res.boom.badData(res.__('Please check all form fields and try again'));
      } else {
        // eslint-disable-next-line max-len
        res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
      }
    }
  }

  /**
   * Get single role
   * @param {Request} req
   * @param {Response} res
   */
  static async getRole(req, res) {
    try {
      // eslint-disable-next-line max-len
      const role = await Role.findById(req.params.id).populate(req.populate);
      res.send({
        data: role
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Update role
   * @param {Request} req
   * @param {Response} res
   */
  static async updateRole(req, res) {
    try {
      const role = await Role.findById(req.params.id);
      if (role) {
        const data = merge(role, req.body);
        await role.update(data);
        res.send({
          data: data
        });
      } else {
        res.status(404).send({
          message: res.__('The %s was not found', 'role')
        });
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
  /**
   * Delete role method
   * @param {Request} req
   * @param {Response} res
   */
  static async deleteRole(req, res) {
    try {
      const role = await Role.findById(req.params.id);
      if (role && !role.deleted) {
        role.softdelete();
        res.send({
          message: res.__('The %s was deleted successfully', 'role')
        });
      } else {
        res.status(404).send({
          message: res.__('The %s was not found', 'role')
        });
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
}

export default RoleController;
