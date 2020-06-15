const http = require('http');
const fs = require('fs');

const RequestConfiguration = {
    host: 'localhost',
    port: 8000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const request = http.request(RequestConfiguration, response => {
    let body = '';
    response.on('data', chunk => body += chunk);
    response.on('end', () => {
        console.log('Status code: ' + response.statusCode);
        console.log('Status message: ' + response.statusMessage);
    });
});

let readStream = fs.createReadStream('./static/test.json');

readStream.pipe(request);
