#!/usr/bin/env node

import {sockets} from 'server';

const {wss} = sockets;

// ws.on('connection', client => console.log('welcome', client.id))
wss.on('connection', (socket) => {
  console.log(socket.id, 'connected via wss');
  socket.on('gol', function(gol) {
    console.log('client: ping');
    wss.emit('pong', 'server: pong ');
  });
});
