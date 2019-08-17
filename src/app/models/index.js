import path from 'path';
import glob from 'glob';

const APP_PATH = process.env.APP_PATH;
const models = {};

/**
 * Load subrouters and log each route into file
 */
glob.sync(path.join(APP_PATH, 'models', '*.js')).forEach((file) => {
  if (file !== __filename) {
    const base = path.basename(file).replace('.js', '');
    models[base] = require(path.join(APP_PATH, 'models', base)).default;
  }
});

export default models;
