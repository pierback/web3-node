const path = require('path');
const moment = require('moment');
const { fromAscii, bytesToHex, hexToString } = require('web3-utils');
const { readFileAsync, getAppDir, getContractParams } = require('./utils');

const accounts = ['0xe8816898d851d5b61b7f950627d04d794c07ca37', '0x5409ed021d9299bf6814279a6a1411a7e866a631', '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb', '0xe36ea790bc9d7ab70c55260c66d52b1eca985f84', '0xe834ec434daba538cd1b9fe1582052b880bd7e63', '0x78dc5d2d739606d31509c31d654056a45185ecb6'];
let web3;
let ip;

async function startBvgl(_web3, _ip) {
  web3 = web3 || _web3;
  ip = ip || _ip;
  console.log('ip: ', ip);
  const { address, abi } = await getContractParams('bvgl', ip);
  console.log('abi: ', typeof abi);
  console.log('\nBeverageList Contract Address: %s\n', address);
  const deployedInstance = new web3.eth.Contract(JSON.parse(abi), address);

  const account = accounts[Math.floor(Math.random() * accounts.length)];

  const gasAmount = await setDrinkDataGasEstimate(deployedInstance, account);
  await setDrinkData(deployedInstance, account, gasAmount);
}

async function getBvrglstAbi() {
  const bvglabiDir = path.join(getAppDir(), '..', 'smart-contracts', 'BeverageList', 'build', 'BeverageList.abi');
  return JSON.parse(await readFileAsync(bvglabiDir));
}

async function setDrinkData(instance, account, gasAmount) {
  console.log('account: ', account);
  console.log('gasAmount: ', gasAmount);
  const drinks = ['water', 'mate', 'coffee'];
  const time = fromAscii(moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'));
  const weekday = fromAscii(days[new Date().getDay()]);
  const drink = fromAscii(drinks[Math.floor(Math.random() * drinks.length)]);

  return new Promise((resolve, reject) => instance.methods
    .setDrinkData(time, drink, weekday)
    .send({ from: account,
      gas: gasAmount })
    .on('transactionHash', (hash) => {
      console.log('hash: ', hash);
      resolve();
    })
    .on('receipt', (receipt) => {
      printEvent(receipt);
      console.log('Starting over');
      setTimeout(startBvgl, 2000);
    })
    .on('error', (err) => {
      console.log('setDrinkData error: ', err);
    }));
}

function printEvent(receipt) {
  if (receipt.events.NewDrink) {
    const { Address, time, drink, weekday } = receipt.events.NewDrink.returnValues;
    console.log('receipt:');
    console.log('  Address', Address);
    console.log('  time', hexToString(time));
    console.log('  drink:', hexToString(drink));
    console.log('  weekday: %s\n\n', hexToString(weekday));
  } else {
    console.log('receipt: %o \n\n', receipt);
  }
}

async function getBvrglstAddress() {
  const address = path.join(getAppDir(), '..', 'smart-contracts', 'BeverageList', 'contractAddress');
  const bin = await readFileAsync(address);
  return bytesToHex(bin);
}

async function setDrinkDataGasEstimate(instance, account) {
  const fomat = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
  const weekday = fromAscii('heuterrrrr');
  const drink = fromAscii('mateteter');
  const time = fromAscii(fomat);

  return new Promise((resolve, reject) => {
    instance.methods
      .setDrinkData(time, drink, weekday)
      .estimateGas({ from: account })
      .then(gasAmount => resolve(gasAmount))
      .catch((error) => {
        console.log('error: ', error);
        reject();
      });
  });
}

async function watchEvents(instance) {
  return instance.events
    .NewDrink({ filter: { myIndexedParam: [20, 23] },
      fromBlock: 0,
      toBlock: 'latest' })
    .on('data', (event) => {
      console.log('Event data', event.returnValues);
    })
    .on('error', err => console.log('Error on watching', err));
}

let days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

module.exports = { startBvgl };
