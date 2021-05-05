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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected with mysql database...')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Create User
const bcrypt = require('bcrypt');
const { json, response } = require('express');
const e = require('express');

app.post('/auth/register', async (req, res) => {

  try {
    // encripts password 1 way hash
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    const email = req.body.email

    // chacks if there is a user with that email
    connection.query("select * from users WHERE email = " + connection.escape(req.body.email), function (err, results, fields) {
      if (err) throw err;

        if(results.length === 0){

          // creates user
          connection.query("INSERT INTO users (email,password) VALUES (" + connection.escape(email) + "," + connection.escape(hashedPassword) + ")", function (err, results, fields) {
            if (err) throw err;
          });

          res.status(202).json({email: 'good',user_created: 'yes'})
        }
        else {
          res.status(403).json({email: 'bad',user_created: 'no'})
        }
      
    })

  }
  catch {
    res.status(500).json({email: 'unknown',user_created: 'no'})
  }
  
});

// Logout
app.post('/auth/logout',(req, res) => {

  var hasCookie = ('key' in req.cookies)

  // creates query to remove access token from database
  let query = "UPDATE users SET access_token = NULL WHERE access_token = " + connection.escape(req.cookies.key)

  if(hasCookie) {
    try {
      // runs query to remove token
      connection.query(query,[req.cookies.key], function (err, results, fields) {
        if (err) throw err;

        // removes cookie
        res.clearCookie('key');
        res.status(202).json({logout: 'good'})
      })
      
    } 
    catch (error) { 
      res.status(500).json({logout: 'bad'})
    }
  }
  else {
    // returns if there is no need to log user out
    res.status(200).json({logout: 'no-login'})
  }

})

// login api request
app.post('/auth/login', async (req, res) => {

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

            // creates a api access token 
            var user_token = uuid.v4()

            // cretaes SQL query to be used to setting the access token
            let query = "UPDATE users SET access_token = " + connection.escape(user_token) + " WHERE email = " + connection.escape(req.body.email)

            try {

              // sets the api token as the api token for that user
              connection.query(query, function (error, results, fields) { 
                if (error) throw error;

                // sets the api token in the cookie
                res.cookie('key', user_token, {expire: 360000 + Date.now()});
                res.status(202).json({email: 'good',password: 'good'})
              });

              
            } catch (error) {
              // Its not good it this code runs
              console.log(error)
              res.status(500).send() 
            }

          }
          else {
            // returns if the user has put in the wrong password
            res.status(401).json({email: 'good',password: 'bad'})
          }
        });

      }
      
      if(results.length == 0) {
        // if the user enters a email that dose not exist
        res.status(401).json({email: 'bad',password: 'bad'})
      }

      if(results.length > 1) {
        // this should never happen if you get this reply then you have a problem with you database
        res.status(500).send()
      }

    });

  }
  catch {
    // if this happens then there is a problem with the database or code in the catch statement
    res.status(400).send()
  }
  
});

// API auth chack //
// looks at the user key and see if they are allowed to access the page //
var auth = async function(req, res, next) {

  // chacks if the access token is set in the cookie
  var hasCookie = ('key' in req.cookies)

  const passedAuth = function () {
    return next();
  }

  const noauth = function () {
    return res.sendStatus(401);
  }

  // this chacks if the token is valid
  const tokenCheck = async function() {
    connection.query("select * from users WHERE access_token= " + connection.escape(req.cookies.key), function (err, results, fields) {
      if(results.length == 1){
        passedAuth()
      }
      else {
        noauth()
      }
    }
    )
  }

  // This runs the token chack if there is a key in the cookie to chack
  if (hasCookie){
    try {

      tokenCheck()
      
    } catch (error) {
      
    }
  }
  else {
    noauth()
  }


}

app.get('/private', auth ,function (req, res) {
  res.send("welcome to a private page")
});