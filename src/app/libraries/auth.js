import User from 'models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const APP_SECURE_SALT = process.env.APP_SECURE_SALT;
const APP_SECURE_KEY = process.env.APP_SECURE_KEY;
const APP_SECURE_EXPIRATION = process.env.APP_SECURE_EXPIRATION;

/**
 * Class to handle authentication
 */
export default class Auth {
  /**
   * Conventional login using username and password
   * @void
   * @param {Object} params
   * @param {String} password
   */
  static async connect(params, password) {
    if ('email' in params && password) {
      const user = await User.findOne(params).select(['+password', 'lastLogin', 'token']);
      console.log(user);
      if (!user) {
        throw new Error('UserAuthenticationException');
      }

      const match = await Auth.compare(password || '', user.password);

      if (match) {
        const data = {
          sub: user.id,
        };
        const options = {
          expiresIn: APP_SECURE_EXPIRATION,
        };
        const token = jwt.sign(data, APP_SECURE_KEY, options);
        const payload = await jwt.verify(token, APP_SECURE_KEY);
        user.token = token;
        user.lastLogin = new Date();
        await user.save();
        return {
          accessToken: `Bearer ${token}`,
          expiresAt: payload.exp
        };
      } else {
        throw new Error('UserAuthenticationException');
      }
    }
  }

  /**
   * Social Authentication
   * @void
   * @param {String} id
   * @return {Null}
   */
  static async social(id) {

  }

  /**
   * Token validation
   * @param {String} token
   * @return {Object}
   */
  static async verify(token) {
    if (token) {
      const payload = await jwt.verify(token, APP_SECURE_KEY);
      return payload;
    }

    err.status = 400;
    err.text = 'Token is not valid or was expirated';
    throw err;
  }

  /**
   * Make password hash
   * @param {String} password
   * @return {String}
   */
  static async hash(password) {
    return await bcrypt.hash(password, Number(APP_SECURE_SALT));
  }

  /**
   * Hash comparison
   * @param {String} password
   * @param {String} hash
   * @return {Promise}
   */
  static async compare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}


