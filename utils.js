const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const { getIP } = require('./udp');

const appDir = path.dirname(require.main.filename);

async function getServerIP() {
  return getIP();
}

async function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      err ? reject() : resolve(data);
    });
  });
}

async function getContractParams(filename, ip) {
  try {
    const url = `http://${ip}:9090/files/${filename}.json`;
    console.log('url: ', url);
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


function getAppDir() {
  return appDir;
}

function getBchainIp(ip) {
  return `ws://${ip}:8546`;
  // const bchainIp = path.join(appDir, '..', 'private-net-docker', 'bchainIp');
  // return await readFileAsync(bchainIp);
}
module.exports = { readFileAsync,
  getBchainIp,
  getContractParams,
  getAppDir };
