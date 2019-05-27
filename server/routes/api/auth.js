const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// getting the local authentication type
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('User');

const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
};

//store user id
passport.serializeUser((user, done) => {
    done(null, user._id)
});
//get user by id
passport.deserializeUser((id, done) => {
    User.findById(id, '-password', (err, user) => {
        done(err, user);
    });
});

passport.use('local-signin', new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password"
    },

    (email, password, done) => {
        process.nextTick(async function () {
            try {
                let user = await User.findOne({ email: email });

                if (!user)
                    return done(null, false, { message: 'User not found' });

                if (user.checkPassword(password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            } catch (e) {
                console.log(e);
                return done(null, false, { message: 'Internal server error' });
            }
        });
    })
);

passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {

        process.nextTick(async () => {
            try {
                console.log(email, password);
                let user = await User.findOne({ email });

                if (user)
                    return done(null, false, { message: 'This email address is already taken' });

                User.create({ email, password }, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    return done(null, result);
                });
            } catch (e) {
                console.log(e);
                return done(null, false, { message: e });
            }
        });
    })
);

// router.post('/signup', (req, res, next) => {
//     passport.authenticate("local-signup", (err, user, info) => {
//         if (err) {
//             return next(err);
//         }
//
//         if (!user) {
//             return res.status(400).send([user, "Cannot sign up", info]);
//         }
//
//         req.login(user, err => {
//             res.send({
//                 email: user.email,
//                 _id: user._id
//             });
//         });
//     })(req, res, next);
// });

router.post('/login', (req, res, next) => {
    passport.authenticate("local-signin", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).send([user, "Cannot log in", info]);
        }

        req.login(user, err => {
            res.send({
                email: user.email,
                _id: user._id
            });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    return res.send("logged out");
});

router.get('/user', authMiddleware, async (req, res) => {
    let user = await User.findOne({ _id: req.session.passport.user });

    res.send({
        email: user.email,
        _id: user._id
    });
});

module.exports = router;