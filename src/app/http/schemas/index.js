// import {registerSchema} from 'schemas/auth';
import glob from 'glob';
import path from 'path';
const APP_PATH = process.env.APP_PATH;

let schemas = {};

glob.sync(APP_PATH + '/http/schemas/*.js').forEach((file) => {
  if (file !== __filename) {
    const base = path.basename(file).replace('.js', '');
    const schema = require(path.join(APP_PATH, 'http/schemas', base));
    schemas = {...schemas, ...schema.default};
  }
});

export default schemas;
