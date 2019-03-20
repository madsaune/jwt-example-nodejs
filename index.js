const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
let userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    permissions: Object,
    active: Boolean,
    tokenLastIssued: Date,
    createdOn: Date,
    updateOn: Date 
});

userSchema.methods.verify = function(password) {
    return this.password === password;
};

let User = mongoose.model('User', userSchema);

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ "auth": false, "message": "No token provided." });

    jwt.verify(token, config.jwtsecret, (err, decoded) => {
        if (err) return res.status(401).send({ "auth": false, "message": "Token is not valid." });

        req.user = decoded;
        next();
    });
}

app.get('/api/auth/verify', verifyToken, (req, res) => res.sendStatus(200));

app.post('/api/auth/login', (req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username }, (err, user) => {
        if (err) return res.sendStatus(500);
        if (user === null) return res.status(404).json({ "auth": false, "message": "Incorrect username or password." });

        if (user.verify(password)) {
            const payload = {
                "username": user.username,
                "name": user.name,
                "email": user.email
            };
    
            const token = jwt.sign(payload, config.jwtsecret, {
                "expiresIn": 86400 // 24 hours
            });

            res.status(200).json({
                "auth": true,
                "token": token,
                "user": user
            });
        }
    });
});

app.post('/api/protected', verifyToken, (req, res) => {
    res.status(200).json({
        "error": false,
        "decoded": req.user
    });
});

app.listen(8080, () => console.log("Server listening on port 8080..."));