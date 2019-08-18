import casbin from 'libraries/casbin';

/**
 * Grant or deny user access to admin endpoints
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function canAccessToAdmin(req, res, next) {
  const roles = await casbin.getRolesArray(req.user.id);
  if (roles.includes('admin')) {
    req.permissions = await casbin.getRolePolicies('admin');
    next();
  } else {
    res.boom.forbidden();
  }
};

/**
 * Grant or deny access to read orders
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function canReadAnyOrder(req, res, next) {
  const can = await casbin.canUser(req.user.id, 'read', 'order:*');
  if (can) {
    next();
  } else {
    res.boom.forbidden();
  }
}
