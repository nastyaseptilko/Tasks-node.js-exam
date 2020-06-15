// чтобы удалить какую-нить строку, ее нужно сначала добавить в какую-нить таблицу
//      потому что все остальные строки связаны с другими таблицами и ты не сможешь их удалить.

// POSTMAN
// DELETE запорос вида localhost:3000/<имя таблицы капсом>
// в теле JSON объект вида {"id":"<id строки>"}. Пример: URL: localhost:3000/FACULTY BODY: {"id":"ИТ"}

var http = require('http');
var sql = require('mssql/msnodesqlv8');
var url = require('url');

const pool = new sql.ConnectionPool({
    database: "node",
    server: "ARTEMY-MAC",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
});


// если мало времени, лучше удалить и не палиться, что ты, якобы, так много написал за короткое время
// получает все строки из таблицы
let GET_handler = (request, response) => {
    const table = url.parse(request.url, true).pathname.slice(1); // slice обрезает один символ с начала строки
    console.log("table: " + table);
    pool.connect()
        .then(() => {
            pool.request().query(`select * from ${table}`, (error, result) => {
                if (error) {
                    console.log(error.message);
                    response.writeHead(404, { "X-Error-Description": "database internal error." });
                    response.end(`<h1>Invalid query or table ${table} does not exist.</h1>`);
                } else {
                    console.log(result.recordset);
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end(JSON.stringify(result.recordset));
                }

                pool.close();
            });
        });

};

let DELETE_handler = (request, response) => {
    const table = url.parse(request.url, true).pathname.slice(1); // slice обрезает один символ с начала строки
    console.log("table: " + table);

    let data = '';
    request.on('data', (chunk) => {
        data += chunk;
    });

    request.on('end', () => {
        try {
            const id = JSON.parse(data).id;
            console.log("id: " + id);
            pool.connect()
                .then( () => {
                    pool.request().query(`delete from ${table} where ${table} = '${id}'`, (error, result) => {
                        if (error) {
                            console.log(error);
                            response.writeHead(404, { "X-Error-Description": "Deleting data error." });
                            response.end(`<h1>Invalid query or table ${table} does not exist </h1>`);
                        } else {
                            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8"});
                            response.end(`<h1>Deleting success</h1>`);
                            console.log("Deleting success");
                            console.log(result.toString());
                        }
                        pool.close();
                    });
                });
        } catch (error) {
            response.writeHead(404, { "X-Error-Description": "Invalid object data." });
            response.end(`<h1>Request error. Put the JSON object like {"id":"ИТ"} to delete it.</h1>`);
        }

    });
};

OTHER_handler = (req, res) => {
    res.writeHead(405, { "X-Error-Description": "Invalid method.", "Content-Type": "text/html;charset=utf-8" });
    res.end("<div>Invalid request.</div>");
};


let http_handler = (request, response) => {
    console.log(request.method, " - ", request.url);
    response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
    switch (request.method) {
        case "GET": {
            GET_handler(request, response);
            DELETE_handler(request, response);
            break;
        }
        case "DELETE": {
            DELETE_handler(request, response);
            break;
        }
        default: {
            OTHER_handler(request, response);
            break;
        }
    }
};

let server = http.createServer();
server.listen(3000, () => {
    console.log("server.listen(3000)");
});

server.on('error', (e) => {
    console.log("server.listen(3000); error: ", e);
});
server.on('request', http_handler);
