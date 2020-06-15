const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
    if (request.method === 'POST') {
        let writeStream = fs.createWriteStream('./static/server-file.json'); //поток записи
        request.pipe(writeStream); //преенаправляет то что получил в запросе в поток записи
        response.statusCode = 200;
        response.end();
    } else {
        response.statusCode = 404;
        response.end();
    }
});

server.listen(8000, () => {
    console.log('Listening to http://localhost:8000');
});
