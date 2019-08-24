import auth from 'libraries/auth';
import User from 'models/User';
import Profile from 'models/Profile';
import Conekta from 'libraries/conekta'; // eslint-disable-line
import request from 'request-promise';
import md5 from 'md5';
import {createCustomer, defineNickname} from 'helpers/users';
import objectid from 'objectid';
import casbin from 'libraries/casbin';

/**
 * Auth Controller
 */
class AuthController {
  /**
  * Login method
  * @param {Request} req
  * @param {Response} res
  */
  static async login(req, res) {
    try {
      const params = {email: req.body.email};
      const accessToken = await auth.connect(params, req.body.password);
      const user = await User.findOne(params).populate(['profile', 'roles']);
      res.send({...user.toObject(), ...accessToken});
    } catch (err) {
      console.log(err);
      res.boom.badRequest(res.__(err.message));
    }
  }

  /**
   * Verify facebook token
   * @param {Request} req
   * @param {Response} res
   */
  static async facebook(req, res) {
    let result = null;
    let user = null;
    let profile = null;
    // eslint-disable-next-line max-len
    request(`https://graph.facebook.com/v3.2/me?access_token=${req.body.authResponse.accessToken}&fields=email,gender,birthday,first_name,last_name`)
        .then(async (body) => {
          const data = JSON.parse(body);
          // eslint-disable-next-line max-len
          if (data.id === req.body.id && data.id == req.body.authResponse.userID) {
            profile = await Profile.findOne({social: {facebook: data.id}});
            if (!profile) {
              const userFields = {};
              userFields.firstName = data.first_name;
              userFields.lastName = data.last_name;
              userFields.social = {facebook: data.id};
              userFields.password = await auth.hash(md5(data.id));
              if (data.email) {
                userFields.email = data.email;
              }
              if (data.gender) {
                userFields.gender = data.gender;
              }
              if (data.birthday) {
                userFields.dob = new Date(data.birthday);
              }

              const customer = await createCustomer(userFields);

              user = customer.user;
              profile = customer.profile;
            }
            // eslint-disable-next-line max-len
            user = await User.findOne({profile: profile.id}).populate('profile');
            const token = await auth.social(user.id);
            result = {...user.toObject(), token};
            res.send(result);
          }
        })
        .catch((err) => {
          res.boom.unauthorized(res.__(err.message));
        });
  }

  /**
   * Verify google token
   * @param {Request} req
   * @param {Response} res
   */
  static async google(req, res) {
    let result = null;
    let user = null;
    let profile = null;
    request(`https://www.googleapis.com/userinfo/v2/me?access_token=${req.body.authResponse.access_token}`)
        .then(async (body) => {
          const data = JSON.parse(body);
          // eslint-disable-next-line max-len
          if (data.id === req.body.id && data.id == req.body.id && req.body.email === data.email) {
            profile = await Profile.findOne({social: {google: data.id}});
            if (!profile) {
              const customer = await createCustomer({
                firstName: data.given_name,
                lastName: data.family_name,
                social: {
                  google: data.id,
                },
                email: data.email,
                password: await auth.hash(md5(data.id)),
              });

              user = customer.user;
              profile = customer.profile;
            }

            user = await User.findOne({profile: profile.id}).populate(
                'profile'
            );
            const token = await auth.social(user.id);
            result = {...user.toObject(), token};
            res.send(result);
          }
        })
        .catch((err) => {
          res.boom.unauthorized(res.__(err.message));
        });
  }

  /**
   * Register method
   * @param {Request} req
   * @param {Response} res
   */
  static async register(req, res) {
    try {
      let profile = new Profile();
      let user = new User();

      user.email = req.body.email;
      user.password = await auth.hash(req.body.password);
      user.profile = profile.id;
      profile.firstName = req.body.first_name;
      profile.lastName = req.body.last_name;
      profile.dob = req.body.dob;
      profile.phone = req.body.phone;
      profile.address = {};
      profile.address.country = req.body.country;
      profile.address.region = req.body.region;
      profile.address.city = req.body.city;

      const customer = await Conekta.Customer.create({
        name: `${profile.firstName} ${profile.lastName}`,
        email: user.email,
        phone: profile.phone,
      });

      // eslint-disable-next-line new-cap
      user.roles = [objectid('5d579ff9f761e4bd14ce08c5')];

      // eslint-disable-next-line max-len
      profile.conekta = Object.prototype.hasOwnProperty.call(customer, '_id') ? customer._id : null;
      const fullname = `${req.body.first_name} ${req.body.last_name}`;
      user.nickname = await defineNickname(fullname.toLowerCase());

      user = await user.save();
      profile = await profile.save();
      casbin.assignRole(user._id, 'customer', '*');
      res.send({
        message: res.__('Your account was created succesfully'),
        data: {
          ...user.toObject(),
          profile: profile.toObject()
        }
      });
    } catch (err) {
      // eslint-disable-next-line max-len
      if ('email' in err.errors && err.errors.email.message === 'EmailAlreadyTakenException') {
        res.boom.badData(res.__('The %s is already taken.', 'email'));
      }
      if (err.name && err.name === 'ValidationError') {
        // eslint-disable-next-line max-len
        res.boom.badData(null, {...err, message: res.__('Please check all form fields and try again')});
      } else {
        res.status(err.status || 400).send(err);
      }
    }
  }

  /**
   * Verify account
   */
  static async verify() {}

  /**
   * Recover password
   */
  static async recover() {}

  /**
   * Disable account
   */
  static async disable() {}

  /**
   * Enable account
   */
  static async enable() {}

  /**
   * Verify JWT token
   * @param {Request} req
   * @param {Response} res
   */
  static async whoami(req, res) {
    const user = await User.findOne({_id: req.user.id}).populate(['profile']);
    res.send({user});
  }
}

export default AuthController;
