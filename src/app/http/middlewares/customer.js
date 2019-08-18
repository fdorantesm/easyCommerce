import casbin from 'libraries/casbin';
import Rule from 'models/Rule';

/**
 * Grant access if user can buy
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function canBuy(req, res, next) {
  const roles = await casbin.getRolesArray(req.user.id);
  if (roles.includes('customer') && !req.user.ban) {
    next();
  } else {
    res.boom.forbidden(res.__('Your account is not allowed to %s', 'buy'));
  }
}

/**
 * Grant access to read order if allowed
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function canReadOrder(req, res, next) {
  const can = await casbin.canUser(req.user.id, 'read', 'order', 'order:' + req.params.order);
  if (can) {
    next();
  } else {
    res.boom.forbidden(res.__('Your account is not allowed to %s', 'view this order'))
  }
}

