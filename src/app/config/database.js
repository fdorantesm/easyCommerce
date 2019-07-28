import mongoose from 'mongoose';

export default () => {
  mongoose.set('debug', process.env.DB_DEBUG == 'true' );
  mongoose.Promise = global.Promise;

  const uri = {};

  // eslint-disable-next-line max-len
  uri.auth = process.env.DB_USER ? `${process.env.DB_USER}:${process.env.DB_PASS}@` : '';
  uri.host = process.env.DB_HOST;
  uri.base = process.env.DB_BASE ? `/${process.env.DB_BASE}` : 'test';
  uri.port = process.env.DB_PORT ? `:${process.env.DB_PORT}` : '';
  uri.string = `mongodb://${uri.auth}${uri.host}${uri.port}${uri.base}`;

  return {
    uri: uri.string,
    config: {
      useNewUrlParser: true
    }
  };
};
