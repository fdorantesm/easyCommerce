import path from 'path';

export default (app) => {
  app.set('view engine', process.env.APP_VIEWS_ENGINE || 'pug');
  app.set('views', path.join(process.env.APP_PATH, 'views'));
  app.set('secret', process.env.APP_SECURE_KEY);
  app.set('salt', process.env.APP_SECURE_SALT);
  app.set('x-powered-by', process.env.APP_EXPOSE || false);
  app.set('token_expires', process.env.APP_SECURE_EXPIRATION);
  return app;
};
