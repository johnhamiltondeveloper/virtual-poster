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

  console.log("start")

  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    const email = req.body.email

    connection.query("select * from users WHERE email = " + connection.escape(req.body.email), function (err, results, fields) {
      if (err) throw err;

        if(results.length === 0){

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

  let query = "UPDATE users SET access_token = NULL WHERE access_token = " + connection.escape(req.cookies.key)

  if(hasCookie) {
    try {
      connection.query(query,[req.cookies.key], function (err, results, fields) {
        if (err) throw err;

        res.clearCookie('key');
        res.status(202).json({logout: 'good'})
      })
      
    } 
    catch (error) { 
      res.status(500).json({logout: 'bad'})
    }
  }
  else {
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

            console.log("Password accepted")

            var user_token = uuid.v4()

            let query = "UPDATE users SET access_token = " + connection.escape(user_token) + " WHERE email = " + connection.escape(req.body.email)

            try {

              connection.query(query, function (error, results, fields) { 
                if (error) throw error;

                res.cookie('key', user_token, {expire: 360000 + Date.now()});
                res.status(202).json({email: 'good',password: 'good'})
              });

              
            } catch (error) {
              console.log(error)
              res.status(500).send() 
            }

          }
          else {

            console.log("Wrong password")
            res.status(401).json({email: 'good',password: 'bad'})
          }
        });

      }
      
      if(results.length == 0) {
        res.status(401).json({email: 'bad',password: 'bad'})
      }

      if(results.length > 1) {
        res.status(500).send()
      }

    });

  }
  catch {
    // returns an bad Request if the server fails
    res.status(400).send()
  }
  
});

// authentication middleware chacks if the user can access this
var auth = async function(req, res, next) {

  var hasCookie = ('key' in req.cookies)

  const passedAuth = function () {
    return next();
  }

  const noauth = function () {
    return res.sendStatus(401);
  }

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

app.get('/customer', auth ,function (req, res) {
  connection.query('select * from users', function (err, results, fields) {
   if (err) throw err;
   res.json(results).send();
 });
});