const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const JWT_CONFIG = {
    pvt_key: 'notSecure?',
    duration: 1,
    keyid: 'user'
}

const User = {
    details: {
        firstName: 'Solomon',
        lastName: 'Bush',
        email: 'm.solomon.bush@gmail.com',
        phone: '678-900-5850',
        role: 'admin',
    },
    creds: {
        username: 'root',
        password: 'toor'
    }
}

const JWTEncode = (payload) => {
    return jwt.sign({ payload }, JWT_CONFIG.pvt_key, { expiresIn: JWT_CONFIG.duration * 60, keyid: JWT_CONFIG.keyid })
}

const JWTInterceptor = (req, res, next) => {
    if (req.headers['authorization']) {
        let bearerToken = (req.headers['authorization']).split(' ')[1]

        jwt.verify(bearerToken, JWT_CONFIG.pvt_key, (err, decoded) => {
            if (err) {
                res.status(401).send(err)
            } else {
                req.jwtPayload = decoded.payload
                next()
            }
        })
    } else {
        res.status(403).send('No Bearer Token')
    }
}


app.all('/api/login', (req, res) => {
    if (req.body.username && req.body.password) {
        if (req.body.username === User.creds.username && req.body.password === User.creds.password) {
            res.send({
                user: User.details,
                token: JWTEncode({ username: (User.creds.username), role: (User.details.role) }),
                exp: JWT_CONFIG.duration

            })
        }
        else {
            res.status(403).send('Invalid Request')
        }
    } else {
        res.status(401).send('Invalid Request')
    }
})

app.all('/api/validate', JWTInterceptor, (req, res) => {
    res.send(true)
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})