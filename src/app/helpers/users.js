import slug from 'slug';
import User from 'models/User';

/**
 * Helper to create customer
 * @param {Object} data
 * @return {Customer}
 */
export async function createCustomer(data) {
  return {};
}

/**
 * Method to calculate available nickname
 * @param {String} nickname
 * @param {Integer} attemp
 */
export async function defineNickname(nickname, attemp = 1) {
  const identifier = attemp === 1 ? '' : attemp;
  // eslint-disable-next-line max-len
  const rows = await User.countDocuments({nickname: `${slug(nickname.replace(' ', ''))}${identifier}`});
  if (rows > 0) {
    return defineNickname(slug(nickname.replace(' ', '')), attemp + 1);
  } else {
    return slug(nickname.replace(' ', '')) + identifier.toString();
  }
}
