import casbin from 'libraries/casbin';

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
  // eslint-disable-next-line max-len
  const e = await casbin.getInstance();
  const y = await e.hasRoleForUser('5d59d348118d9c0e8b4741cb', 'admin', '*');
  console.log({y});
  // eslint-disable-next-line max-len
  const permission = await casbin.can(req.user.id, `order:${req.params.order}`, 'order', 'read');
  if (permission.granted) {
    next();
  } else {
    // eslint-disable-next-line max-len
    res.boom.forbidden(res.__('Your account is not allowed to %s', 'view this order'));
  }
}
