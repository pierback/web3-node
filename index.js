const Web3 = require('web3');
const { startBvgl } = require('./bvrglst');
const { startCC } = require('./cffcn');

(async function main() {
  // const ip = await getIP();
  const web3 = await initWeb();
  if (process.argv[2] === 'bl') {
    console.log('process.argv[2]: ', process.argv[2]);
    startBvgl(web3, 'oc-appsrv01.informatik.uni-augsburg.de').catch((err) => {
      console.log('Error bvgl: ', err);
    });
  } else if (process.argv[2] === 'cc') {
    startCC(web3, 'oc-appsrv01.informatik.uni-augsburg.de').catch((err) => {
      console.log('Error CC: ', err);
    });
  }
}());

async function initWeb() {
  const bchainIp = 'ws://oc-appsrv01.informatik.uni-augsburg.de:8546';// getBchainIp(ip);
  console.log('bchainIp: ', bchainIp);
  const web3 = new Web3(bchainIp);
  console.log('web3: ', web3);
  return web3;
}
