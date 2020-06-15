var http = require('http');
var fs = require('fs');
const sql = require('mssql/msnodesqlv8');


let POST_handler = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    var insertedObject = '';

    if (parseUrl.pathname.includes("/api/")) {
        var table = parseUrl.pathname.replace("/api/", "");

        console.log("table: " + table);

        req.on('data', (data) => {
            insertedObject += data;
        });
        req.on('end', () => {
            try {
                let obj = JSON.parse(insertedObject);
                console.log(obj);

                selectRequest(table);

                setTimeout(() => {
                    var equal = true;
                    for (i in obj)
                        if (!objects[0].hasOwnProperty(i))
                            equal = false;
                    //console.log("COMPARE: " + compareObjects(obj, objects[0]));
                    console.log(equal);
                    if (equal) {
                        pool.connect().then(() => {
                            var keys = Object.keys(obj);
                            var array = Object.values(obj);

                            var k = "";
                            var v = "";

                            for (var i = 0; i < keys.length; i++) {
                                if (i != 0) {
                                    k += ` , ${keys[i]} `;
                                    v += ` , '${array[i]}' `;
                                } else {
                                    k += ` ${keys[i]} `;
                                    v += ` '${array[i]}' `;
                                }
                            }
                            console.log(k + "    " + v);

                            pool.request().query(`insert into ${table} (${k}) values (${v})`, (err, result) => {
                                if (err) {
                                    res.end(JSON.stringify({
                                        code: 1,
                                        message: `Row not added to table ${table}`
                                    }));
                                } else {
                                    console.log("Inserted");
                                    res.end(JSON.stringify({message: `Data inserted successfully`}));
                                }
                                pool.close();
                            });
                        });
                    }
                }, 1000);
            } catch {
                console.log("PARSE ERROR");
            }
        })
    }
};

let http_handler = (req, res) => {

    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
    });

    console.log(req.method, " - ", req.url);
    if(req.method == "POST") {
        POST_handler(req, res);
    }
};

let server = http.createServer();
server.listen(3000, () => {
    console.log("server.listen(3000)");
}).on('error', (e) => {
    console.log("server.listen(3000); error: ", e);
}).on('request', http_handler);

const pool = new sql.ConnectionPool({
    database: "FORLAB",
    server: "DESKTOP-AOL90O5\\SSQLSERVER",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
});

var objects;


function selectRequest(table) {
    pool.connect().then(() => {
        pool.request().query(`select * from ${table}`, (err, result) => {
            if (err) {
                res.end(JSON.stringify({
                    code: 1,
                    message: `Table ${table} does not exist`
                }));
            } else {
                //console.log(result.recordset);
                objects = result.recordset;
            }
            pool.close();
        });
    });
}





