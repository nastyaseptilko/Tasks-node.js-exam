var http = require('http');

let params =  JSON.stringify({
    __comment: "Request.hello",
    x: 1,
    y: 2,
    message: "lalala",
    array: ["a", "b"],
    about: {surname: "Septilko", name:"Nastya"}
});

let options = {
    host: 'localhost',
    path: '/json',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': params.length
      }
}
//регистрирум запрос
//options куда делаем запрос
//(response) обрабатывется ответ который приходит от сервера
const request = http.request(options, (response)=>{
    console.log('method: ', request.method);
    console.log('response: ', response.statusCode);
    console.log('statusMessage: ', response.statusMessage);

    let data ='';
    response.on('data', (chunk)=>{
        console.log('data: body: ', data += chunk.toString('utf-8'));
    });
});

request.on('error', (e)=>{console.log('error: ', e.message);});
request.write(params); //отправляем тело в запрос json параметры
request.end(); //отправила серверу запрос