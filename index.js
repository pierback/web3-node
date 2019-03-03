const Web3 = require("web3");
const web3 = new Web3("ws://0.0.0.0:8546");
const { startBvgl } = require("./bvrglst");
const { startCC } = require("./cffcn");
const { unlockAccount } = require('./utils');

(async function main() {
  unlockAccount(web3);
  if (process.argv[2] == "bl") {
    startBvgl(web3);
  }
  if (process.argv[2] == "cc") {
    startCC(web3);
  }
})();

