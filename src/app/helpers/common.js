import slugify from 'slugify';
import fs from 'fs';

const $app = process.env.APP_PATH;
const $src = process.env.SRC_PATH;

/**
 * Make slug
 * @param {String} string
 * @return {String}
 */
export function slug(string) {
  return slugify(string, {
    replacement: '-',
    remove: null,
    lower: true
  });
}

/**
 * Return pug buffer
 * @param {String} path
 * @return {String}
 */
export function view(path) {
  const file = `${$app}/views/${path}.pug`;
  if (fs.existsSync(file)) {
    return file;
  } else {
    const error = new Error('Not Found');
    error.message = 'View not found';
    throw error;
  }
}
