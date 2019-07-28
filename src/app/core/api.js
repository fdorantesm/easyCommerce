import middlewares from 'core/middlewares';
import routes from 'core/routes';
import permissions from 'config/acl';
import path from 'path';
import fs from 'fs';
import config from 'core/config';
import debug from 'debug';

const dbugger = debug('api:express');

export default (app) => {
  dbugger('booting %o', 'ecommerce');
  config(app);

  if (process.env.APP_VIEWS_ENGINE) {
    const views = path.join(process.env.APP_PATH, 'views');
    fs.existsSync(views) || fs.mkdirSync(views);
  }

  switch (process.env.ENV) {
    case 'local':

      break;

    case 'test':

      break;

    case 'production':

      break;
  }

  permissions();

  middlewares(app);

  routes(app);

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {error, env: process.env.ENV});
  });

  return app;
};
