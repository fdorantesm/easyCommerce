import Adapter from '@elastic.io/casbin-mongoose-adapter'
import getConfig from 'config/database'
import mapValues from 'lodash/mapValues';
import zipObject from 'lodash/zipObject';
import Rule from 'models/Rule';

const casbin = require('casbin')

/**
 * Enforcer class
 */
export default class Casbin {
  /**
   * Get enforcer instance
   */
  static async getInstance() {
    const db = getConfig();
    const adapter = await Adapter.newAdapter(db.uri, db.config);
    const model = `${process.env.STORAGE_PATH}/casbin/rbacd.conf`;
    return casbin.newEnforcer(model, adapter);
  }
  /**
   * Asign an entity to a role via enforcer
   *
   * @param {String} identifier
   * @param {String} role
   * @param {String} domain
   * @return {Promise}
   */
  static async assignRole(identifier, role, domain) {
    const e = await EnforcerHelper.getInstance();
    return await e.addGroupingPolicy(identifier, role, domain)
  }

  /**
   * Revoke role user
   * @param {String} identifier
   * @param {String} role
   * @param {String} domain
   * @return {Promise}
   */
  static async revokeRole(identifier, role, domain = 'admin') {
    // eslint-disable-next-line max-len
    const result = await Rule.remove({p_type: 'g', v0: identifier, v1: role, v2: domain});
    return !!result.ok;
  }

  /**
   * Revoke all user domain roles
   * @param {String} identifier
   * @param {String} domain
   * @return {Promise}
   */
  static async revokeRoles(identifier) {
    const result = await Rule.remove({p_type: 'g', v0: identifier});
    return !!result.ok;
  }

  /**
   * Create policy for a new resource
   * @param {String} role
   * @param {String} domain
   * @param {String} resource
   * @param {String} action
   * @return {Promise}
   */
  static async createPolicy(role, domain, resource, action) {
    const e = await EnforcerHelper.getInstance();
    return e.addPolicy(role, domain, resource, action);
  }
  /**
   * Return user role map object via enforcer
   * @param {String} identifier
   * @return {Promise}
   */
  static async getRoles(identifier) {
    const e = await EnforcerHelper.getInstance();
    const pol = await e.getFilteredGroupingPolicy(0, identifier);
    return pol.map((value) => {
      value.splice(0, 1)
      return zipObject(['role', 'domain'], value);
    });
  }

  /**
   * Return a list of policies
   * @param {String} identifier filter
   * @return {Promise}
   */
  static async getPolicies(identifier = false) {
    const e = await EnforcerHelper.getInstance();
    // Load the policy from DB.
    await e.loadPolicy();
    if (identifier) {
      return e.getFilteredPolicy(0, identifier);
    } else {
      return e.getPolicy();
    }
  }
  /**
   * Return a list of groupPolicies
   * @param {String} role filter
   * @return {Promise}
   */
  static async getGroupPolicies(role = false) {
    const e = await EnforcerHelper.getInstance();
    await e.loadPolicy();
    if (role) {
      const perms = e.getFilteredGroupingPolicy(0, role);
      return perms;
    } else {
      return e.getGroupingPolicy();
    }
  }

  /**
   * Revoke role
   * @param {String} identifier
   * @param {String} role
   * @return {Promise}
   */
  static async removeRoleFromUser(identifier, role) {
    const e = await EnforcerHelper.getInstance();
    // Load the policy from DB.
    await e.loadPolicy()
    return await e.removeGroupingPolicy(identifier, role);
    await e.savePolicy()
  }

  /**
   * Get roles array
   * @param {String} identifier
   * @return {Promise<String[]>}
   */
  static async getRolesArray(identifier) {
    const policies = await EnforcerHelper.getRoles(identifier);
    // eslint-disable-next-line max-len
    const roles = Array.from(new Set(Object.values(mapValues(policies, 'role'))));
    return roles;
  }

  /**
   * Get role policies
   * @param {String} role
   * @return {Promise.<Object[]>}
   */
  static async getRolePolicies(role) {
    try {
      // eslint-disable-next-line max-len
      const policies = await Rule.find({p_type: 'p', v0: role}).select(['-_id', 'v0', 'v1', 'v2']);
      return policies;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Return if role can make actions with resouce
   * @param {String} role
   * @param {String} action
   * @param {String} resource
   * @return {Boolean}
   */
  static async canRole(role, action, resource) {
    // eslint-disable-next-line max-len
    const policy = await Rule.findOne({p_type: 'p', v0: role, v1: resource, v2: action});
    return !!policy;
  }

  /**
   * Return if role can make actions with resouce
   * @param {String} identifier
   * @param {String} action
   * @param {String} resource
   * @param {String} domain
   * @return {Boolean}
   */
  static async canUser(identifier, action, resource, domain) {
    const roles = await Rule.find({v0: identifier, v1: {$nin: ['customer', 'guest']}}).select(['-_id', 'v1', 'v2']);
    const policies = await Rule.find({
      p_type: 'p',
      v0: {
        $in: roles.map((role) => role.v1)
      },
      v2: resource,
      v3: action
    }).select(['-_id', '-p_type']);

    for (const rule of [].concat(roles, policies)) {
      const isAdmin = (rule.v0 === 'admin' && rule.v1 === domain && rule.v2 == resource && rule.v3 === action) || rule.v1 === 'admin' && rule.v2 === '*';
      const isOwner = rule.v1 === 'owner' && rule.v2 === domain;
      if (isAdmin || isOwner) {
        return true;
      }
    }
    return false;
  }

  /**
   * Find for given policy
   * @param {String} identifier
   * @param {String} role
   * @param {String} domain
   * @return {Boolean}
   */
  static async getPolicyFor(identifier, role, domain) {
    // eslint-disable-next-line max-len
    const rule = await Rule.countDocuments({p_type: 'g', v0: identifier, v1: role, v2: domain});
    return !!rule;
  }

  /**
   * Method to know if user has a role given
   * @param {String} identifier
   * @param {String} role
   * @param {domain} domain
   * @return {Promise.<Boolean>}
   */
  static async hasRole(identifier, role, domain = '*') {
    // const enforcer = await Enforcer.getInstance();
    // return enforcer.hasRoleForUser(identifier, role);
    const rules = await Rule.count({
      p_type: 'g',
      v0: identifier,
      v1: role,
      v2: domain
    });
    return rules > 0;
  }


}
