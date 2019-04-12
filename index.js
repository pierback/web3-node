const Web3 = require('web3');
const { startBvgl } = require('./bvrglst');
const { startCC } = require('./cffcn');
const { getBchainIp } = require('./utils');
const { getIP } = require('./udp');

(async function main() {
  const ip = '192.168.188.23';
  // const ip = 'oc-appsrv01.informatik.uni-augsburg.de';
  // const ip = await getIP();
  console.log('ip: ', ip);
  const web3 = await initWeb(ip);
  if (process.argv[2] === 'bl') {
    console.log('process.argv[2]: ', process.argv[2]);
    startBvgl(web3, ip).catch((err) => {
      console.log('Error bvgl: ', err);
    });
  } else if (process.argv[2] === 'cc') {
    startCC(web3, ip).catch((err) => {
      console.log('Error CC: ', err);
    });
  }
}());

async function initWeb(ip) {
  const bchainIp = getBchainIp(ip);
  console.log('bchainIp: ', bchainIp);
  return new Web3(bchainIp);
}
