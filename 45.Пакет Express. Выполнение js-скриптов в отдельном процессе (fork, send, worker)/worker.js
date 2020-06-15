const { Worker, isMainThread } = require('worker_threads');
//только  главный
//всего 2 процесса, главный и новый (не главный)
if (isMainThread) { //если это главный процесс  , то мы создаем новый worker в кот указывем файлнэйм текущий
    let t1 = new Worker(__filename); //worker.js , создали новый воркер ,он выполняет тот же код, но у него isMainThread=false , поэтому мы идем по ветке else
   //console.log(__filename)
    setInterval(() => {
        console.log('main')
    }, 3000);

} else {
    setInterval(() => {
        console.log('w1');
    }, 6000);
}