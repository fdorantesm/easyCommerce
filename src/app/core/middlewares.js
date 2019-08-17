import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import favicon from 'serve-favicon';
import fs from 'fs';
import logger from 'morgan';
import rfs from 'rotating-file-stream';
import serve from 'serve-static';
import i18n from 'i18n';
import locales from 'config/i18n';
import Auth from 'middlewares/auth';
import boom from 'express-boom';
import fileUpload from 'express-fileupload';
import path from 'path';
import populate from 'middlewares/populate';
import models from 'middlewares/models';

const PWD = process.env.PWD;
const APP_PATH = process.env.APP_PATH;
const APP_PUBLIC = process.env.APP_PUBLIC;
const APP_STATIC= process.env.APP_STATIC;

export default (app) => {
  const logDirectory = path.join(APP_PATH, 'logs');

  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  app.use(logger('dev'));
  app.use(logger('combined', {
    stream: rfs(
        'access.log', {
          interval: '1d',
          path: logDirectory,
        }
    ),
  }));


  if (APP_PUBLIC) {
    app.use(serve(path.join(PWD, APP_PUBLIC)));
  }

  if (APP_STATIC) {
    app.use(path.join('/', APP_STATIC), serve(path.join(PWD, APP_STATIC)));
    if (fs.existsSync(path.join(PWD, APP_STATIC, 'favicon.png'))) {
      app.use(favicon(path.join(APP_STATIC, 'favicon.png')));
    }
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(cors({origin: '*'}));
  app.use(fileUpload({
    safeFileNames: true,
  }));

  i18n.configure(locales);

  app.use(i18n.init);

  app.use(boom());

  app.use(populate);

  app.use(models);

  app.use(Auth.handshake, Auth.authorization);

  app.use(compression());

  return app;
};
