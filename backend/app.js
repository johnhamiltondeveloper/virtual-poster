require('dotenv').config()

const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

const session = require('express-session')

const cookieParser = require('cookie-parser');

app.use(cookieParser());

var uuid = require('uuid');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// MySQL Connection
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'database',
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected with mysql database...')
})

// This is just used for testing perposes ###### Remove
app.get('/r', (req, res) => {

  res.sendfile("register.html");
});

app.get('/l', (req, res) => {

  res.sendfile("login.html");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Password managment
const bcrypt = require('bcrypt');
const { json } = require('express');
const e = require('express');

app.post('/register', async (req, res) => {

  req.session.loggedin = true;

  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    console.log(salt)
    console.log(hashedPassword)

    const email = req.body.email

    connection.query("INSERT INTO users (email,password) VALUES (?,?)",[connection.escape(email),connection.escape(hashedPassword)], function (err, results, fields) {
      if (err) throw err;
    });

    res.status(201).send()
  }
  catch {
    console.log("error password not working")
    res.status(500).send()
  }
  
});

// Logout
app.get('/logout',(req, res) => {

  var hasCookie = ('key' in req.cookies)

  let query = "UPDATE users SET access_token = NULL WHERE access_token = " + connection.escape(req.cookies.key)

  if(hasCookie) {
    try {
      connection.query(query,[req.cookies.key], function (err, results, fields) {
        if (err) throw err;

        res.clearCookie('key');
        res.send('Done')
      })
      
    } 
    catch (error) { 
    }
  }
  else {
    res.send('No need')
  }

})

// login api request
app.post('/login', async (req, res) => {

  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    // querys the database to find a the user 
    connection.query("select * from users WHERE email = " + connection.escape(req.body.email), function (err, results, fields) {
      if (err) throw err;
      
      // gets first item in the
      var row = results[0];

      // If the server returns more then 1 result there is a Internal Server Error
      if(results.length == 1) {

        // Chacks if the password is the same one as the one on the database
        bcrypt.compare(
        req.body.password, row.password, function(err, result) {
          if (result == true) {

            console.log("Password accepted")

            var user_token = uuid.v4()

            let query = "UPDATE users SET access_token = " + connection.escape(user_token) + " WHERE email = " + connection.escape(req.body.email)

            console.log(query)

            try {

              connection.query(query, function (error, results, fields) { 
                if (error) throw error;

                res.cookie('key', user_token, {expire: 360000 + Date.now()});
                res.status(202).send() 
              });

              
            } catch (error) {
              console.log(error)
              res.status(500).send() 
            }

          }
          else {

            console.log("Wrong password")
            res.status(401).send()
          }
        });

      }
      else {
        // if the sql returns more then 1 user with the same email there is an error
        res.status(500).send()
      }

    });

  }
  catch {
    // returns an bad Request if the server fails
    res.status(400).send()
  }
  
});

var auth = async function(req, res, next) {

  var hasCookie = ('key' in req.cookies)
  var canLogin = false

  if (hasCookie){
    try {

      await connection.query('select * from users WHERE access_token=?',[connection.escape(req.cookies.key)], function (err, results, fields) {
        if(results.length == 1){
          canLogin = true
        }
      })

      console.log(canLogin)
      
    } catch (error) {
      
    }
  }

  if (canLogin)
    return next();
  else
    return res.sendStatus(401);
}

app.get('/customer', auth ,function (req, res) {
  connection.query('select * from users', function (err, results, fields) {
   if (err) throw err;
   res.end(JSON.stringify(results));
 });
});