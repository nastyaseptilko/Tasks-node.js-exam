const app = require('express')();
const {createClient} = require('webdav');
const config = require('./cfg.json');
const webDavClient = createClient(config.url, config.login);
const PORT = 3000;

app.post('/md/:newDirectory', (req, res) => {
    console.log('/POST /md/:newDirectory');
    webDavClient.exists(`/${req.params.newDirectory}`)
        .then((exist) => {
            if (exist) {
                res.status(408);
                return {error: 'Directory exists'};
            } else {
                return webDavClient.createDirectory(`/${req.params.newDirectory}`)
                    .then(() => ({
                        message: `Directory '/${req.params.newDirectory}' created`
                    }));
            }
        })
        .then((message) => {
            res.json(message)
        })
        .catch((err) => {
            res.status(400).json({error: err.toString()})
        });
});

app.post('/rd/:removeDirectory', (req, res) => {
    console.log('/POST /rd/:removeDirectory');
    webDavClient.exists(`/${req.params.removeDirectory}`)
        .then(exist => {
            if (exist) {
                return webDavClient.deleteFile(`/${req.params.removeDirectory}`)
                    .then(() => ({message: `Directory /${req.params.removeDirectory} removed`}));
            } else {
                res.status(408);
                return {error: 'Directory isn`t exists'};
            }
        })
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json({error: err.toString()}));
});

app.post('/up/:uploadFile', (req, res) => {
    console.log('/POST /up/:uploadFile');
    try {
        req.pipe(webDavClient.createWriteStream(`/${req.params.uploadFile}`))
            .on('end', () => {
                res.json({message: `File /${req.params.uploadFile} uploaded`})
            });
    } catch (err) {
        res.status(408).json({error: err.toString()})
    }
});

app.post('/down/:downloadFile', (req, res) => {
    console.log('/POST /down/:downloadFile');
    webDavClient.exists(`/${req.params.downloadFile}`)
        .then(exist => {
            if (exist) {
                webDavClient.createReadStream(`/${req.params.downloadFile}`).pipe(res);
            } else {
                res.status(404);
                return {error: 'File isn`t exists'};
            }
        })
        .then((message) => {
            message ? res.json(message) : null
        })
        .catch((err) => {
            res.status(400).json({error: err.toString()})
        });
});

app.post('/del/:removeFile', (req, res) => {
    console.log('/POST /del/:removeFile');
    webDavClient.exists(`/${req.params.file}`)
        .then(exist => {
            if (exist) {
                return webDavClient.deleteFile(`/${req.params.removeFile}`)
                    .then(() => ({message: `File /${req.params.removeFile} removed`}));
            } else {
                res.status(408);
                return {error: 'File is not exists'};
            }
        })
        .then((message) => {
            res.json(message)
        })
        .catch((err) => {
            res.status(400).json({error: err.toString()})
        });
});

app.post('/copy/:copyFile1/:pastFile2', (req, res) => {
    console.log('/POST /copy/:copyFile1/:pastFile2');
    webDavClient.exists(`/${req.params.copyFile1}`)
        .then(exist => {
            if (exist) {
                try {
                    return webDavClient.copyFile(`/${req.params.copyFile1}`, `/${req.params.pastFile2}`)
                        .then(() => ({message: `File '/${req.params.copyFile1}' copied to /${req.params.pastFile2}`}));
                } catch (err) {
                    res.status(404);
                    return {error: 'File can`t be copied'};
                }
            } else {
                res.status(408);
                return {error: 'File isn`t exists'};
            }
        })
        .then((message) => {
            res.json(message)
        })
        .catch((err) => {
            res.status(400).json({error: err.toString()})
        });
});

app.post('/move/:fromFile1/:toFile2', (req, res) => {
    console.log('/POST /move/:fromFile1/:toFile2');
    webDavClient.exists(`/${req.params.fromFile1}`)
        .then(exist => {
            if (exist) {
                try {
                    return webDavClient.moveFile(`/${req.params.fromFile1}`, `/${req.params.toFile2}`)
                        .then(() => ({message: `File '/${req.params.fromFile1}' moved to /${req.params.toFile2}`}));
                } catch (err) {
                    res.status(404);
                    return {error: 'File can`t be moved'};
                }
            } else {
                res.status(408);
                return {error: 'File isn`t exists'};
            }
        })
        .then((message) => {
            res.json(message)
        })
        .catch((err) => {
            res.status(400).json({error: err.toString()})
        });
});


app.listen(PORT, () => {
    console.log(`Listening on https://localhost:${PORT}`);
})
    .on('error', (e) => {
        console.log(`Listener | error: ${e.code}`)
    });
