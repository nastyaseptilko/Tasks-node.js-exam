const express = require('express');
const app = express();
const child = require('child_process');
const fp = child.fork('./index2.js');//запуск дочернего процесса ?????

const f = () => {
    console.log('file 1');
}
setInterval(f, 3000); //выводим каждые 3сек

let x = 0;
const s = () => {
    fp.send(`msg from file1: ${++x}`);
}
setInterval(s, 6000); //в доч. процесс отправляется сообщение

app.listen(3000);
//fork - создание процессов в linux, создает ĸопию теĸущего процесса и запусĸает ее отдельно.
// Должны сразу определить остались ли мы в том же процессе, либо уже в дочернем.
// Там в примере создается новый эĸземпляр V8, т.ĸ node.js однопоточный и выполняется передаваемый сĸрипт.
//Потоĸи создается самим node.js. Worker - позволяет создавать потоĸи isMainThread - в основном потоĸе находимся или нет