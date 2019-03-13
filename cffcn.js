const path = require('path');
const { bytesToHex } = require('web3-utils');
const { readFileAsync, getAppDir, getContractParams } = require('./utils');

const ranFuncs = [payCoffee, payWater, payMate];

async function startCC(web3, ip) {
  const { address, abi } = await getContractParams('cc', ip);
  console.log('\nBeverageList Contract Address: %s\n', address);
  const deployedInstance = new web3.eth.Contract(JSON.parse(abi), address);

  await getChairBalance(deployedInstance);
  await getOwnBalance(deployedInstance);

  const ccFunc = ranFuncs[Math.floor(Math.random() * ranFuncs.length)];

  await ccFunc(deployedInstance);

  await getChairBalance(deployedInstance);
  await getOwnBalance(deployedInstance);

  setTimeout(() => {
    startCC(web3, ip);
  }, 3000);
}

async function getCffcnAddress() {
  const address = path.join(
    getAppDir(),
    '..',
    'smart-contracts',
    'CoffeeCoin',
    'contractAddress',
  );
  const bin = await readFileAsync(address);
  return bytesToHex(bin);
}

async function getCffcnstAbi() {
  const cffcnDir = path.join(
    getAppDir(),
    '..',
    'smart-contracts',
    'CoffeeCoin',
    'build',
    'CoffeeCoin.abi',
  );
  return JSON.parse(await readFileAsync(cffcnDir));
}

async function getChairBalance(instance) {
  return new Promise((resolve, reject) => instance.methods
    .getChairBalance()
    .call({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37' })
    .then((result) => {
      console.log('getChairBalance: %s \n', JSON.stringify(result));
      resolve();
    })
    .catch((err) => {
      console.log('getChairBalance', err);
      resolve();
    }));
}

async function getOwnBalance(instance) {
  return new Promise((resolve, reject) => instance.methods
    .getOwnBalance()
    .call({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37' })
    .then((result) => {
      console.log('getOwnBalance: %s \n', JSON.stringify(result));
      resolve();
    }));
}

async function payCoffee(instance) {
  return new Promise((resolve, reject) => instance.methods
    .payCoffee()
    .send({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37',
      gas: 2300000 })
    .on('transactionHash', (hash) => {
      console.log('payCoffee hash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('payCoffee receipt: \n');
      resolve();
    })
    .on('error', (err) => {
      console.log('payCoffee error: ', err);
    }));
}

async function payMate(instance) {
  return new Promise((resolve, reject) => instance.methods
    .payMate()
    .send({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37',
      gas: 2300000 })
    .on('transactionHash', (hash) => {
      console.log('payMate hash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('payMate receipt: \n');
      resolve();
    })
    .on('error', (err) => {
      console.log('payMate error: ', err);
    }));
}

async function payWater(instance) {
  return new Promise((resolve, reject) => instance.methods
    .payWater()
    .send({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37',
      gas: 2300000 })
    .on('transactionHash', (hash) => {
      console.log('payWater hash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('payWater receipt: \n');
      resolve();
    })
    .on('error', (err) => {
      console.log('payWater error: ', err);
    }));
}

async function transferGasEstimate(instance) {
  console.log('transferGasEstimate: ');
  return new Promise((resolve, reject) => instance.methods
    .transfer('18ef96d887954472de5e9f47d60ba8dea371dbfe', 2)
    .estimateGas({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37',
      gas: 5000000 })
    .then(gasAmount => resolve(gasAmount))
    .catch((error) => {
      console.log('error: ', error);
      reject();
    }));
}

async function transfer(instance, gasAmount) {
  console.log('transfer: ');
  return new Promise((resolve, reject) => {
    instance.methods
      .transfer('18ef96d887954472de5e9f47d60ba8dea371dbfe', 2)
      .send({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37',
        gas: gasAmount })
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

module.exports = { startCC };
