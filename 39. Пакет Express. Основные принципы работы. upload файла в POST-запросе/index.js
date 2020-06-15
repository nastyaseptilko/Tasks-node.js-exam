const app = require('express')();
const multer = require('multer');

const upload = multer({dest: 'uploads/'});

app.post("/upload", upload.single('myfile'), (req, res, next) => {
    console.log(req.file);
    res.type('txt').send('file upload ' + req.file.originalname);
});

app.listen(3000);
console.log('Server run http://localhost:3000/upload');//зайтии в form.html
