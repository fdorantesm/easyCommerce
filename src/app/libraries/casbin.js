const casbin = require('casbin');
import Adapter from 'casbin-mongoose-adapter';
import getConfig from 'config/database';
import zipObject from 'lodash/zipObject';

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
    const adapter = new Adapter(db.uri, db.config);
    await adapter.init();
    const model = `${process.env.APP_PATH}/config/casbin/rbac.conf`;
    return await casbin.newEnforcer(model, adapter);
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
    const enforcer = await Enforcer.getInstance();
    await enforcer.loadPolicy();
    await enforcer.addGroupingPolicy(identifier, role, domain);
    return enforcer.savePolicy();
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
    await enforcer.loadPolicy();
    await enforcer.addPolicy(role, domain, resource, action);
    return enforcer.savePolicy();
  }
  /**
   * Return user role map object via enforcer
   * @param {String} identifier
   * @return {Promise}
   */
  static async getRoles(identifier) {
    const enforcer = await Enforcer.getInstance();
    await enforcer.loadPolicy();
    const pol = await enforcer.getFilteredGroupingPolicy(0, identifier);
    return pol.map((value) => {
      value.splice(0, 1);
      return zipObject(['role', 'domain'], value);
    });
  }

  /**
   * Return a list of policies
   * @param {String} identifier filter
   * @return {Promise}
   */
  static async getPolicies(identifier = false) {
    const enforcer = await Enforcer.getInstance();
    await enforcer.loadPolicy();
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
    await enforcer.loadPolicy();
    if (role) {
      return enforcer.getFilteredGroupingPolicy(0, role);
    } else {
      return enforcer.getGroupingPolicy();
    }
  }
}
