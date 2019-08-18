import User from 'models/User';
import Profile from 'models/Profile';
import Role from 'models/Role';
import casbin from 'libraries/casbin';
import {defineNickname} from 'helpers/users';
import mapValues from 'lodash/mapValues';
/**
 * User Controller
 */
class UserController {
  /**
   * Get all users method
   * @param {Request} req
   * @param {Response} res
   */
  static async getUsers(req, res) {
    try {
      const options = {
        page: req.query.page || 1,
        populate: req.populate
      };
      const users = await User.paginate({deleted: false}, options);
      res.send({
        data: users
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
  /**
   * Get user method
   * @param {Request} req
   * @param {Response} res
   */
  static async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id).populate(req.populate);
      if (user) {
        res.send({
          data: user
        });
      } else {
        res.boom.notFound(res.__('The %s was not found', 'user'));
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
  /**
   * Create user
   * @param {Request} req
   * @param {Response} res
   */
  static async createUser(req, res) {
    try {
      // Create model instances
      const user = new User();
      const profile = new Profile();
      const role = await Role.findOne({name: req.body.role});
      // Assign model properties
      user.email = req.body.email;
      user.password = req.body.password;
      user.roles = [];
      if (role._id) {
        user.roles.push(role._id);
      }
      user.profile = profile._id;
      profile.firstName = req.body.first_name;
      profile.lastName = req.body.last_name;
      profile.phone = req.body.phone;
      // Looking for an available nickname
      user.nickname = await defineNickname(
          `${req.body.first_name} ${req.body.last_name}`.toLowerCase()
      );

      // If usuer role is customer creates conekta user
      if (req.body.role === 'customer') {
        const customer = await Conekta.Customer.create({
          name: `${profile.firstName} ${profile.lastName}`,
          email: user.email,
          phone: profile.phone,
        });
        // eslint-disable-next-line max-len
        profile.conekta = Object.prototype.hasOwnProperty.call(customer, '_id') ? customer._id : null;
      }
      await user.save();
      await profile.save();
      await casbin.assignRole(user._id, role.name, '*');
      user.profile = profile;
      res.send({
        data: user
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      if (err.errors.email && err.errors.email.message === 'EmailAlreadyTakenException') {
        res.boom.badData(res.__('The %s is already taken', 'email'));
      }
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Add user role
   * @param {Request} req
   * @param {Resonse} res
   */
  static async assignRole(req, res) {
    try {
      const roles = await casbin.getRoles(req.params.id);
      // eslint-disable-next-line max-len
      const currentRoles = Array.from(new Set(Object.values(mapValues(roles, 'role'))));
      const user = await User.findById(req.params.id);
      const role = await Role.findById(req.body.role);
      console.log({currentRoles});
      if (!currentRoles.includes(role.name)) {
        // eslint-disable-next-line max-len
        await casbin.assignRole(user._id, role.name, req.body.domain);
        const update = await User.findByIdAndUpdate(user._id, {
          $push: {
            roles: role._id
          }
        });
        res.send({
          data: update.toObject()
        });
      } else {
        res.boom.badRequest(res.__('User already has %s role', role.name));
      }
    } catch (err) {
      console.log({x: err});
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Revoke user role
   * @param {Request} req
   * @param {Resonse} res
   */
  static async revokeRole(req, res) {
    try {
      const roles = await casbin.getRoles(req.params.id);
      // eslint-disable-next-line max-len
      const currentRoles = Array.from(new Set(Object.values(mapValues(roles, 'role'))));
      const user = await User.findById(req.params.id);
      const role = await Role.findById(req.params.role);
      if (currentRoles.includes(role.name)) {
        const u = await casbin.revokeRole(user._id, role.name, req.body.domain);
        user.roles = user.roles.filter((r) => {
          return role._id.toString() !== r.toString();
        });
        await user.update({roles: user.roles});
        res.send({
          data: u,
          message: res.__('The %s was deleted successfully', 'role')
        });
      } else {
        res.boom.badRequest(res.__('The user has not %s role', role.name));
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }

  /**
   * Revoke user domain roles
   * @param {Request} req
   * @param {Resonse} res
   */
  static async revokeRoles(req, res) {
    try {
      const roles = await casbin.getRoles(req.params.id);
      // eslint-disable-next-line max-len
      const currentRoles = Array.from(new Set(Object.values(mapValues(roles, 'role'))));
      const user = await User.findById(req.params.id);
      if (currentRoles.length > 0) {
        const u = await casbin.revokeRoles(user._id);
        await user.update({roles: []});
        res.send({
          data: u,
          message: res.__('The %s were deleted successfuly', 'roles')
        });
      } else {
        res.boom.badRequest(res.__('The user has not %s', 'roles'));
      }
    } catch (err) {
      console.log({x: err});
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
  /**
   * Get user roles
   * @param {Request} req
   * @param {Response} res
   */
  static async getRoles(req, res) {
    const policies = await casbin.getRoles(req.params.id);
    // eslint-disable-next-line max-len
    // const roles = Array.from(new Set(Object.values(mapValues(policies, 'role'))));
    res.send({
      data: policies
    });
  }
}

export default UserController;
