import slugify from 'slugify';

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
