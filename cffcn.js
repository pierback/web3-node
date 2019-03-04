const { bytesToHex } = require('web3-utils');

const cffcnDir = '/Users/fabianpieringer/go/src/github.com/pierback/bchain-qlearning/internal/contracts/CoffeeCoin/build/CoffeeCoin.abi';
const { readFileAsync } = require('./utils');

async function startCC(web3) {
  const address = await getCffcnAddress();
  console.log('\nCoffeCoin Contract Address: %s\n', address);
  const abi = await getCffcnstAbi();
  const deployedInstance = new web3.eth.Contract(abi, address);
  await getChairBalance(deployedInstance);
  await getOwnBalance(deployedInstance);

  await payCoffee(deployedInstance);

  // eslint-disable-next-line no-use-before-define
  await getChairBalance(deployedInstance);
  await getOwnBalance(deployedInstance);
}

async function getCffcnAddress() {
  const bin = await readFileAsync('/var/tmp/cffcn');
  return bytesToHex(bin);
}

async function getCffcnstAbi() {
  return JSON.parse(await readFileAsync(cffcnDir));
}

async function getChairBalance(instance) {
  return new Promise((resolve, reject) => {
    instance.methods
      .getChairBalance()
      .call({
        from: '0x02e9f84165314bb8c255d8d3303b563b7375eb61',
      })
      .then((result) => {
        console.log('getChairBalance: %s \n', JSON.stringify(result));
        resolve();
      });
  });
}

async function getOwnBalance(instance) {
  return new Promise((resolve, reject) => {
    instance.methods
      .getOwnBalance()
      .call({
        from: '0x02e9f84165314bb8c255d8d3303b563b7375eb61',
      })
      .then((result) => {
        console.log('getOwnBalance: %s \n', JSON.stringify(result));
        resolve();
      });
  });
}

async function payCoffee(instance) {
  return new Promise((resolve, reject) => {
    instance.methods
      .payCoffee()
      .send({
        from: '0x02e9f84165314bb8c255d8d3303b563b7375eb61',
        gas: 2300000,
      })
      .on('transactionHash', (hash) => {
        console.log('payCoffee hash: ', hash);
      })
      .on('receipt', (receipt) => {
        console.log('payCoffee receipt: \n');
        resolve();
      })
      .on('error', (err) => {
        console.log('payCoffee error: ', err);
      });
  });
}

async function transferGasEstimate(instance) {
  console.log('transferGasEstimate: ');
  return new Promise((resolve, reject) => {
    instance.methods
      .transfer('18ef96d887954472de5e9f47d60ba8dea371dbfe', 2)
      .estimateGas({
        from: '0x02e9f84165314bb8c255d8d3303b563b7375eb61',
        gas: 5000000,
      })
      .then(gasAmount => resolve(gasAmount))
      .catch((error) => {
        console.log('error: ', error);
        reject();
      });
  });
}

async function transfer(instance, gasAmount) {
  console.log('transfer: ');
  return new Promise((resolve, reject) => {
    instance.methods
      .transfer('18ef96d887954472de5e9f47d60ba8dea371dbfe', 2)
      .send({
        from: '0x02e9f84165314bb8c255d8d3303b563b7375eb61',
        gas: gasAmount,
      })
      .on('transactionHash', (hash) => {
        console.log('hash: ', hash);
        resolve();
      })
      .on('receipt', (receipt) => {
        console.log('receipt: ', receipt);
      })
      .on('error', (err) => {
        console.log('setDrinkData error: ', err);
      });
  });
}

module.exports = {
  startCC,
};
