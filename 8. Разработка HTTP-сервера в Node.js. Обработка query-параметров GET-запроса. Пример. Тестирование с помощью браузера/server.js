const http = require('http');
const url = require('url');
let quer;
let server = http.createServer((req, res) => {
    var url_parts = url.parse(req.url, true);

    //console.log(url_parts);
//http://localhost:3000/?x=4
    if (req.method == 'GET') {
        if (url_parts.pathname !== '/') {
            console.log('Invalid path');
            res.writeHead(404, {'X-Error-Message': 'Invalid path', 'Content-type': 'text/json'});
            res.end(JSON.stringify({'Error': 'Invalid path :('}));
        } else {
            if (url_parts.query.text == 'hello') {
                console.log('Client say hello');
            }
            console.log(JSON.stringify(url_parts.query));

            res.writeHead(200, {'Content-type': 'text/json'});
            res.end(JSON.stringify(url_parts.query));

        }
    } else {
        res.writeHead(404, {'X-Error-Message': 'Decline method', 'Content-type': 'text/json'});
        res.end(JSON.stringify({'Error': 'Decline method :('}));
    }
});


server.listen(3000, () => {
    console.log("Start listening port 3000");
})