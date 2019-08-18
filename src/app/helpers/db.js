import fs from 'fs';
import path from 'path';

const APP_PATH = process.env.APP_PATH;

/**
 * Get model names
 * @return {Array.<String>}
 */
export function getModelNames() {
  const models = [];
  fs.readdirSync(path.join(APP_PATH, 'models')).map((file) => {
    if (__filename !== 'index.js') {
      models.push(path.basename(file).replace('.js', ''));
    }
  });
  return models;
}
/**
 * Get roles
 * @return {Promise.<String[]>}
 */
export function getRoles() {
  return Roles.find({deleted: false}).select(['name', '-_id']);
}
