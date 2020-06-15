const express = require ('express');
const app = express();

app.get('/redirect01', (request, response)=>{
    console.log('Redirect 01');
    response.redirect('/redirect02');
});
app.get('/redirect02', (request, response)=>{
    console.log('Redirect 02');
    response.send('Redirect 02');
});
app.post('/redirect03', (request, response)=>{
    console.log('Redirect 03');
    response.redirect(308, '/redirect04');
});
app.post('/redirect04', (request, response)=>{
    console.log('Redirect 04');
    response.send('Redirect 04');
});

app.listen(3000,()=>{
    console.log('Server start http://localhost:3000/')
});

/*
* 3xx: Redirection (перенаправление):
300 Multiple Choices («множество выборов»);
301 Moved Permanently («перемещено навсегда»);
302 Moved Temporarily («перемещено временно»);
302 Found («найдено»);
303 See Other («смотреть другое»);
304 Not Modified («не изменялось»);
305 Use Proxy («использовать прокси»);
306 — зарезервировано (код использовался только в ранних спецификациях);
307 Temporary Redirect («временное перенаправление»);
308 Permanent Redirect («постоянное перенаправление»).
*
* response.redirect('/qwdq')
это то же самое если бы ты делала
response.status(301)
response.setHeader('location', '/qwdq')
response.end();
эта функция отправляет клиенту ответ с кодом 301 и заголовком location, в этом заголовке адрес, куда клиенту надо переадресоваться
* клиент когда видит ответ с кодом трехсотым
делает новый запрос
на тот юрл, который указан в том заголовке location
вот что делает redirect
* то есть ты в постмане не видишь ответ с кодом 308, потому что постман видит переадресацию и сам делает запрос туда, куда ты указала*/