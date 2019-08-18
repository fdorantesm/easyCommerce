import Router from 'router';
import path from 'path';
import glob from 'glob';
import CliTable from 'cli-table';
import trimEnd from 'lodash/trimEnd';
import fs from 'fs';

// eslint-disable-next-line new-cap
const router = Router();

const ROOT_PATH = process.env.ROOT_PATH;
const APP_PATH = process.env.APP_PATH;

// eslint-disable-next-line no-unused-vars
const table = new CliTable({
  head: ['Method', 'Path'],
  colWidths: [15, 50],
});

/**
 * Load subrouters and log each route into file
 */
glob.sync(APP_PATH + '/http/routes/*.js').forEach((file) => {
  if (file !== __filename) {
    const routes = require(file).default;
    const base = `/${path.basename(file).replace('.js', '')}`;
    router.use(base, routes);
    // eslint-disable-next-line max-len
    routes.stack.filter((r) => r.route).map((r) => {
      // eslint-disable-next-line max-len
      Object.keys(r.route.methods).map((method) => {
        // eslint-disable-next-line max-len
        table.push([method.toUpperCase(), trimEnd(base.concat(r.route.path), '/')]);
      });
    });
  }
  // eslint-disable-next-line max-len
  fs.writeFileSync(path.join(ROOT_PATH, '.env.routes'), table.toString().replace(/\x1b\[[0-9;]*m/g, ''));
});

console.log(table.toString());

export default router;
