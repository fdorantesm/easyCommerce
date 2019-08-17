const casbin = require('casbin');
import Adapter from '@elastic.io/casbin-mongoose-adapter';
import getConfig from 'config/database';
import zipObject from 'lodash/zipObject';
import Rule from 'models/Rule';
// eslint-disable-next-line no-unused-vars
import fs from 'fs';

const db = getConfig();

/**
 * Enforcer permissions
 */
export default class Enforcer {
  /**
   * Get Enforcer
   * @return {Promise}
   */
  static async getInstance() {
    // eslint-disable-next-line max-len
    const adapter = await Adapter.newAdapter(db.uri, {...db.config, debug: true});
    const model = `${process.env.STORAGE_PATH}/casbin/rbac.conf`;
    // const database = `${process.env.STORAGE_PATH}/casbin/rules.csv`;
    // fs.existsSync(database) || fs.writeFileSync(database, '');
    // return await casbin.newEnforcer(model, database);
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
  static async assignRole(identifier, role, domain = '*') {
    const enforcer = await Enforcer.getInstance();
    // await enforcer.loadPolicy();
    return enforcer.addRoleForUser(identifier, role, domain);
    // return enforcer.savePolicy();
  }

  /**
   * Revoke role user
   * @param {String} identifier
   * @param {String} role
   * @param {String} domain
   * @return {Promise}
   */
  static async revokeRole(identifier, role, domain = 'admin') {
    // const enforcer = await Enforcer.getInstance();
    // return enforcer.removeGroupingPolicy(identifier, role, domain);
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
    // const enforcer = await Enforcer.getInstance();
    // return enforcer.deleteRolesForUser(identifier);
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
    const enforcer = await Enforcer.getInstance();
    return enforcer.addPolicy(role, domain, resource, action);
  }
  /**
   * Return user role map object via enforcer
   * @param {String} identifier
   * @return {Promise}
   */
  static async getRoles(identifier) {
    const enforcer = await Enforcer.getInstance();
    const policies = await enforcer.getFilteredGroupingPolicy(0, identifier);
    return policies.map((policy) => {
      policy.splice(0, 1);
      return zipObject(['role', 'domain'], policy);
    });
  }

  /**
   * Return a list of policies
   * @param {String} identifier filter
   * @return {Promise}
   */
  static async getPolicies(identifier = false) {
    const enforcer = await Enforcer.getInstance();
    if (identifier) {
      return enforcer.getFilteredPolicy(0, identifier);
    } else {
      return enforcer.getPolicy();
    }
  }

  /**
   * Return a list of groupPolicies
   * @param {String} role
   * @return {Promise}
   */
  static async getGroupPolicies(role = false) {
    const enforcer = await Enforcer.getInstance();
    if (role) {
      return enforcer.getFilteredGroupingPolicy(0, role);
    } else {
      return enforcer.getGroupingPolicy();
    }
  }
}
