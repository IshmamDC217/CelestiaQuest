const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const nasaApi = require('./suppliers/nasaApi');
const reactRoutes = ['/'];
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Options
const options = {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME
};

const sessionStore = new MySQLStore(options);

// const saltRounds = 10; // or whatever number of salt rounds you prefer

// bcrypt.hash('hlrtpse164', saltRounds, function(err, hash) {
//     // Store hash in your password DB.
//     if (err) {
//         console.error('Error hashing password', err);
//     } else {
//         // Here you would update the database with the hashed password
//         console.log('Hashed password is:', hash);
//     }
// });

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
    } else {
        console.log('Connected to the database');
    }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.use(cors());

app.get(reactRoutes, (req, res) => {
    res.sendFile(path.join(__dirname, 'public'));
});

// Passport configuration
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy
passport.use(
    new LocalStrategy((username, password, done) => {
        db.query('SELECT * FROM Users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                return done(error);
            }

            if (results.length === 0) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM Users WHERE id = ?', [id], (error, results) => {
        if (error) {
            return done(error);
        }
        const user = results[0];
        done(null, user);
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected', 'index.html'));
});

app.get('/login', (req, res) => {
    const message = req.flash('error');
    res.render('login', { message });
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy(function (err) {
            if (err) {
                console.log('Error : Failed to destroy the session during logout.', err);
            }
            req.user = null;
            res.redirect('/login');
        });
    });
});

app.post('/fetchAPOD', async (req, res) => {
    try {
        const data = await nasaApi.fetchAPOD(); 
        res.json(data);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});

// app.post('/fetchMarsRoverPhotos', async (req, res) => {
//     try {
//         const { sol, camera } = req.body;
//         const data = await nasaApi.fetchMarsRoverPhotos(sol, camera);
//         res.json(data);
//     } catch (error) {
//         console.error("Error occurred:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// app.post('/fetchNasaImages', async (req, res) => {
//     try {
//         const query = req.body.query;
//         const data = await nasaApi.fetchNasaImages(query);
//         res.json(data);
//     } catch (error) {
//         console.error("Error occurred:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
