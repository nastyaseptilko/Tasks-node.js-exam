const WebSocket = require('ws');

const jsonSocket = new WebSocket('ws://localhost:4000/');

// ЗАПУСКАТЬ С ПАРАМЕТРОМ NODE CLIENT.JS NASTYA
//массив из аргументов , при запуска из консоли
const name = process.argv[2];

jsonSocket.onopen = () => {
    let message = {client: name};
    jsonSocket.send(JSON.stringify(message));
};
//сообщение от сервера
jsonSocket.onmessage = message => {
    console.log(message.data);
};