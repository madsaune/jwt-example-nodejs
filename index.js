const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');

const app = express();
app.use(bodyParser.json());

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ "auth": false, "message": "No token provided." });

    jwt.verify(token, config.jwtsecret, (err, decoded) => {
        if (err) return res.status(401).send({ "auth": false, "message": "Token is not valid." });

        req.user = decoded;
        next();
    });
}

app.get('/api/auth/verify', verifyToken, (req, res) => res.send(200));

app.post('/api/auth/login', (req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    console.log("Username: " + username);
    console.log("Password: " + password);

    let user = {
        "name": "Username",
        "username": username
    };

    const token = jwt.sign(user, config.jwtsecret, {
        "expiresIn": 86400 // 24 hours
    });
    
    res.json({
        "error": false,
        "token": token,
        "user": user
    });
});

app.post('/api/protected', verifyToken, (req, res) => {
    res.json({
        "error": false,
        "decoded": req.user
    });
});

app.listen(8080, () => console.log("Server listening on port 8080..."));