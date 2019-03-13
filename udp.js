const PORT = 9999;
const MULTICAST_ADDR = '239.0.0.0';
const dgram = require('dgram');

const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

socket.bind(PORT);

socket.on('listening', () => {
  socket.addMembership(MULTICAST_ADDR);
//   setInterval(sendMessage, 2500);
});

async function getIP() {
  return new Promise((resolve) => {
    socket.on('message', (message, rinfo) => {
      console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
      if (message) {
        socket.close();
      }
      return resolve(message);
    });
  });
}

module.exports = { getIP };
