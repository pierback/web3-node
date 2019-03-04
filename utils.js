const fs = require('fs');

async function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      err ? reject() : resolve(data);
    });
  });
}

module.exports = {
  readFileAsync,
};
