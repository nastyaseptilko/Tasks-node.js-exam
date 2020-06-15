const app = require('express')();
const passport = require('passport');
const Digest = require('passport-http').DigestStrategy;
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: '123'
});

let Users = require(__dirname + '/users.json');
const PORT = 5000;

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

let Credential = (user) => {
    let us = Users.find(u => u.user.toLowerCase() == user.toLowerCase());
    return us;
};

passport.use(new Digest({qop: 'auth'}, (user, done) => {
    let userRecord = null;
    let userCreds = Credential(user);
    if (!userCreds) {
        console.log('Неверное имя пользователя');
        userRecord = done(null, false);
    } else {
        userRecord = done(null, userCreds.user, userCreds.password);
    }
    return userRecord;
}, (params, done) => {
    console.log(`Параметры: ${JSON.stringify(params)}`);
    done(null, true);
}));

passport.serializeUser((user, done) => {
    console.log('Сериализация юзера');
    done(null, user);
});
passport.deserializeUser((user, done) => {
    console.log('Десириализация юзера');
    done(null, user);
});

app.get('/login', (req, res, next) => {
    console.log('Login')

    if (req.session.logout && req.headers['authorization']) {
        req.session.logout = false;

        delete req.headers['authorization'];
    }

    next();
}, passport.authenticate('digest', {session: false}), (req, res, next) => {
    if (req.session.logout == undefined)
        req.session.logout = false;
    next();
}).get('/login', (req, res, next) => {
    req.session.countOftransitions++;
    res.end(`${req.session.countOftransitions} ` + '| Session id : ' + req.session.id);
})

app.get('/logout', (req, res) => {
    console.log('/GET /logout');
    req.session.logout = true;
    delete req.headers['authorization'];
    res.redirect('/login');
})

app.get('/resource', (req, res) => {
    console.log('/GET /resource');

    if (req.session.logout == false && req.headers['authorization'])
        res.end('Yest dostup k resursu');
    else
        res.redirect('/login')
});


app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})
    .on('error', (e) => {
        console.log(`Listener | error: ${e.code}`)
    });
