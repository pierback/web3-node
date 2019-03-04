const path = require('path');
const moment = require('moment');
const { fromAscii, bytesToHex } = require('web3-utils');
const { readFileAsync } = require('./utils');

const appDir = path.dirname(require.main.filename);

async function startBvgl(web3) {
  const address = await getBvrglstAddress();
  console.log('BeverageList Contract Address: \n', address);
  const abi = await getBvrglstAbi();
  const deployedInstance = new web3.eth.Contract(abi, address);
  const gasAmount = await setDrinkDataGasEstimate(deployedInstance);
  await setDrinkData(deployedInstance, gasAmount);
}

async function getBvrglstAbi() {
  const bvglabiDir = path.join(appDir, '..', 'smart-contracts', 'BeverageList', 'build', 'BeverageList.abi');
  return JSON.parse(await readFileAsync(bvglabiDir));
}

async function setDrinkData(instance, gasAmount) {
  const drinks = ['cola', 'fanta', 'water', 'mate', 'coffee', 'spezi'];
  const time = fromAscii(moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'));
  const weekday = fromAscii(days[new Date().getDay()]);
  const drink = fromAscii(drinks[Math.floor(Math.random() * drinks.length)]);

  return new Promise((resolve, reject) => {
    instance.methods
      .setDrinkData(time, drink, weekday)
      .send({
        from: '0xe8816898d851d5b61b7f950627d04d794c07ca37',
        gas: gasAmount,
      })
      .on('transactionHash', (hash) => {
        console.log('hash: ', hash);
        resolve();
      })
      .on('receipt', (receipt) => {
        console.log('receipt: ', receipt.events.NewDrink.returnValues);
      })
      .on('error', (err) => {
        console.log('setDrinkData error: ', err);
      });
  });
}

async function getBvrglstAddress() {
  const address = path.join(appDir, '..', 'smart-contracts', 'BeverageList', 'contractAddress');
  const bin = await readFileAsync(address);
  return bytesToHex(bin);
}

async function setDrinkDataGasEstimate(instance) {
  const fomat = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
  const weekday = fromAscii('heuterrrrr');
  const drink = fromAscii('mateteter');
  const time = fromAscii(fomat);

  return new Promise((resolve, reject) => {
    instance.methods
      .setDrinkData(time, drink, weekday)
      .estimateGas({ from: '0xe8816898d851d5b61b7f950627d04d794c07ca37' })
      .then(gasAmount => resolve(gasAmount))
      .catch((error) => {
        console.log('error: ', error);
        reject();
      });
  });
}

async function watchEvents(instance) {
  return instance.events
    .NewDrink({
      filter: { myIndexedParam: [20, 23] },
      fromBlock: 0,
      toBlock: 'latest',
    })
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

module.exports = {
  startBvgl,
};
