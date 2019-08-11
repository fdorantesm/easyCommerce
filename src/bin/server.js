/* eslint-disable no-invalid-this */
import dotenv from 'dotenv/config'; // eslint-disable-line
import env from 'env'; // eslint-disable-line
import fs from 'fs';
import http from 'http';
import https from 'https';
import app from 'app';
import socket from 'libraries/io';

const APP_SSL_KEY = process.env.APP_SSL_KEY;
const APP_SSL_CERT = process.env.APP_SSL_CERT;
const APP_SSL_PASSPHRASE = process.env.APP_SSL_PASSPHRASE;
const APP_PORT = process.env.APP_PORT;
const APP_SSL_PORT = process.env.APP_SSL_PORT;

// eslint-disable-next-line max-len
const isAppSSL = APP_SSL_KEY && APP_SSL_CERT && APP_SSL_PASSPHRASE && APP_SSL_PORT;

const server = {
  http: http.createServer(app),
};

server.http.listen(APP_PORT);
server.http.on('error', onError);
server.http.on('listening', onListening);

const sockets = {
  ws: socket(server.http),
};

if (isAppSSL) {
  const key = fs.readFileSync(APP_SSL_KEY);
  const cert = fs.readFileSync(APP_SSL_CERT);
  const secure = {
    key,
    cert,
    passphrase: APP_SSL_PASSPHRASE,
  };
  server.https = https.createServer(secure, app);
  server.https.listen(APP_SSL_PORT);
  server.https.on('error', onError);
  server.https.on('listening', onListening);
  sockets.wss = socket(server.https);
}

/**
 * HTTP Error Callback
 * @param {Error} error
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // eslint-disable-next-line max-len
  const bind = typeof error.port === 'string'? 'Pipe ' + error.port : 'Port ' + error.port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Listen handle callback
 */
function onListening() {
  const protocol = this.cert ? 'https' : 'http';
  const addr = (this.cert ? server.https : server.http).address();
  const bind = typeof addr === 'string'? 'pipe ' + addr : ':' + addr.port;
  console.log(`Listening on ${protocol}://localhost${bind}`);
}

export {server};
export {sockets};
