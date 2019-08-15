import User from 'models/User';
import Profile from 'models/Profile';
import {defineNickname} from 'helpers/users';
// import merge from 'lodash/merge';

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
      // eslint-disable-next-line
      const users = User.paginate({deleted: false}, {page: req.query.page || 1});
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
      const user = User.findById(req.body.id);
      if (user) {
        res.send({
          data: user
        });
      } else {
        res.boom.notFound(res.__('The %s was not found', 'product'));
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
      // Assign model properties
      user.email = req.body.email;
      user.password = req.body.password;
      user.roles = [];
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
      user.profile = profile;
      res.send({
        data: user
      });
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line max-len
      res.boom.badRequest(res.__('There was a problem while trying to resolve your request'));
    }
  }
}

export default UserController;
