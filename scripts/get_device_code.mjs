const https = require('https');

const data = new URLSearchParams({
  client_id: '178c6fc778ccc68e1d6a',
  scope: 'repo'
}).toString();

const options = {
  hostname: 'github.com',
  port: 443,
  path: '/login/device/code',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length,
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(body);
  });
});

req.write(data);
req.end();
