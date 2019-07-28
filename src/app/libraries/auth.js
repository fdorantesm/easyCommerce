// import User from 'model/user'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const APP_SECURE_SALT = process.env.APP_SECURE_SALT;
const APP_SECURE_KEY = process.env.APP_SECURE_KEY;

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


