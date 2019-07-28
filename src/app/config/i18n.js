
import env from 'env'; // eslint-disable-line
import path from 'path';

export default {
  locales: ['es', 'en'],
  objectNotation: true,
  directory: path.join(process.env.APP_PATH, 'locales'),
  updateFiles: true,
  autoReload: true,
  // api: {
  //   '__': 'text',
  //   '__n': 'plural',
  // },
};
