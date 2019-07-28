import socket from 'socket.io';
/**
 * Generate socket instance
 * @param {HTTP} server
 * @return {Socket}
 */
export default function(server) {
  return socket(server);
}
