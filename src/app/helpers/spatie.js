import acl from 'libraries/permissions';

/**
 * Permissions ACL helper class
 */
class Spatie {
  /**
   * User has a given role
   * @param {String} user
   * @param {String} role
   * @return {Promise}
   */
  static async is(user, role) {
    return await acl.hasRole(user, role);
  }

  /**
   * User is allowed to
   * @param {String} user
   * @param {String} permissions
   * @param {String} resource
   * @return {Promise}
   */
  static async can(user, permissions, resource) {
    return await acl.isAllowed(user, resource, permissions);
  }

  /**
   * User permissions
   * @param {String} user
   * @param {String} resources
   * @return {Promise}
   */
  static async permissions(user, resources) {
    if (!resources) {
      const roles = await acl.userRoles(user);
      resources = await Spatie.resources(roles);
    }

    return await acl.allowedPermissions(user, resources);
  }

  /**
   * Get user resources
   * @param {Array} q Roles
   * @param {String} user
   * @return {Array<String>}
   */
  static async resources(q, user) {
    let roles = [];

    if (user == true) {
      roles = await acl._allUserRoles(q);
    } else {
      roles = q;
    }

    const resources = await acl.whatResources(roles);

    return Object.keys(resources);
  }

  /**
   * Add user roles
   * @param {String} user
   * @param {Array} roles
   * @return {Promise}
   */
  static async addUserRoles(user, roles) {
    return await acl.addUserRoles(user, roles);
  }
}

export default Spatie;
