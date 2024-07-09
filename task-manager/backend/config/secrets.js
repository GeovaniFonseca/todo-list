const crypto = require('crypto');
const fs = require('fs');
const algorithm = 'aes-256-ctr';
const password = process.env.SECRET_PASSWORD;

function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, password);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, password);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const secrets = JSON.parse(decrypt(fs.readFileSync('secrets.json', 'utf8')));

module.exports = { encrypt, decrypt, secrets };
