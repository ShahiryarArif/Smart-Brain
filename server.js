/*
* API Design
/ --> res = this is working
/signin --> POST = sucess/fail
/register --> POST = user  (will return new user object)
/profile/:userId --> GET = user
/image --> PUT = user

*Transaction: Use when we have to do more then two things at once
    Code blocks that we can add to make sure that when we are doing multiple operations on database if one fails then all fail.
*/

/*
We will user res.json() because it have some added fetures when responding with json
Slight difference is not response that it return json string
*/

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controlers/register');
const signin = require('./controlers/signin');
const profile = require('./controlers/profile');
const image = require('./controlers/image');

const app = express();

const db =knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'root',
        database: 'smart-brain'
    }
});

//db.select('*').from('users').then(console.log);

/*
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'banana',
            entries: 0,
            joined: new Date()  
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}
*/

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    // res.send('This is working');
    res.send(database.users)
})


//  app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/signin', signin.handleSignin( db, bcrypt )) //call function and then runs another function which automatically recieves (req, res)   

// app.post('/register', register.handleRegister(req, res))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // This is called as dependencies injection

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(3001,()=> {
    console.log('app is running on port 3001');
})



/* 
*Database Queries:

CREATE TABLE users (
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL
);

CREATE TABLE login (
	id serial PRIMARY KEY,
	hash VARCHAR(100) NOT NULL,
	email text UNIQUE NOT NULL
);

*/