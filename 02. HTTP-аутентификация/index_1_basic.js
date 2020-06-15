const app = require('express')();
const passport = require('passport');
const Basic = require('passport-http').BasicStrategy;
const session = require('express-session')({
    resave: true,
    saveUninitialized: false,
    secret: 'exam'
});

let Users = require(__dirname + '/users.json');

const PORT = 4000;

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

function Credential(userToFind) {
    console.log(userToFind);
    let foundUser = Users.find(u => u.user.toLowerCase() === userToFind.toLowerCase());
    return foundUser;
};

function verificate(password, passwordDB) {
    return passwordDB == password;
};


passport.use(new Basic((user, password, done) => {
    let userRecord = null;
    let userCreds = Credential(user);
    if (!userCreds) {
        console.log('Неправильное имя пользователя');
        userRecord = done(null, false, {message: 'Неправильное имя пользователя'});
    } else if (!verificate(userCreds.password, password)) {
        console.log('Неверный пароль');
        userRecord = done(null, false, {message: 'Неверный пароль'});
    } else {
        userRecord = done(null, user, {message: 'Валидные данные'});
    }

    return userRecord;
}));

passport.serializeUser((user, done) => {
    console.log('Сериализация юзера');
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('Десериализация юзера');
    done(null, user);
});


let logoutHandler = (req, res, next) => {
    console.log('Logout handler');
    if (req.session.logout && req.headers['authorization']) {
        req.session.logout = false;
        req.session.countOftransitions = 0;
        delete req.headers['authorization'];
    }

    next();
};

app.get('/login', logoutHandler, passport.authenticate('basic'), (req, res, next) => {
    if (req.session.logout == undefined)
        req.session.logout = false;
    next();

}).get('/login', (req, res) => {
    req.session.countOftransitions++;
    res.end(`${req.session.countOftransitions} ` + '| Session id : ' + req.session.id);
});

app.get('/logout', (req, res) => {
    console.log('/GET /logout');
    req.session.logout = true;
    delete req.headers['authorization'];
    res.redirect('/login');
})

app.get('/resource', (req, res) => {
    console.log('/GET /resource');

    if (req.session.logout == false && req.headers['authorization'])
        res.end('Ti avtorizovan');
    else
        res.redirect('/login')
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
}).on('error', (e) => {
    console.log(`Listener | error: ${e.code}`)
});

