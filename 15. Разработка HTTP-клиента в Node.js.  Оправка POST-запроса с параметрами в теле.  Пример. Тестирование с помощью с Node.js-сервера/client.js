const http = require('http');

let obj = {
    name : "nastya",
    lastName : "septilko"
};

let options = {
    hostname : 'localhost',
    port : 3000,
    path : '/',
    method : 'POST'
};

let data = '';
const request = http.request(options, (response) => {
    response.on('data', chunk => {
        data += chunk;
    });

    response.on('end', () => {
        console.log(data); //получаем от сервера
    });
});
request.write(JSON.stringify(obj));
request.end();