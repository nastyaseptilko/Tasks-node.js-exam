const WebSocket = require('ws');

const jsonSocket = new WebSocket.Server({
    port: 4000,
    host: 'localhost',
    path: '/'
});

let messageCount = 0;

jsonSocket.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message);
        message.server = messageCount++; //добавили поле "server"
        ws.send(JSON.stringify(message));//отправили его на клиент
        console.log(message);
    });
});