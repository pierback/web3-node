const fs = require("fs");

async function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      err ? reject() : resolve(data);
    });
  });
}

async function unlockAccount(web3) {
  web3.eth.personal.unlockAccount(
    "0x02e9f84165314bb8c255d8d3303b563b7375eb61",
    "0000",
    10000
  );
}

module.exports = {
  readFileAsync,
  unlockAccount
};
