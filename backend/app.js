require('dotenv').config()

const express = require('express');

const app = express();
const port = 3000;


// allows the frontend be able to accees the backend from a differnt domain/prot then the backend one
var cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_DOMAIN,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded());

const session = require('express-session')

const cookieParser = require('cookie-parser');

app.use(cookieParser());

var uuid = require('uuid');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 1000
  }
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
        // inserts the userID into the request so it can be used by auth pages
        req.userID = results[0].UserID
        req.user_level = results[0].user_level
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

app.post('/auth/level',auth,function (req, res) {
  res.status(200).json({user_level: req.user_level})
});

// login test area
app.get('/private', auth ,function (req, res) {
  res.send("welcome to a private page")
});

app.post('/conference/create',auth,function (req, res) {

  // Creates a Random confernce ID
  var conferenceID = uuid.v4()

  // Is there a name feild in the body of the http req
  if('name' in req.body) {

    // Create a SQL query to create a new event object in the database
    let query = "INSERT INTO event (EventID,name,EventOwner) VALUES ('" + conferenceID + "'," + connection.escape(req.body.name) + "," + connection.escape(req.userID) + ")"
    try {
      connection.query(query, function (error, results, fields) { 
        if (error) throw error;

        // returns that the conference was created
        res.status(202).json({create: 'good', conferenceID: conferenceID})

      });

      
    } catch (error) {
      // returns if there is an error with the sql query
      // this may happen if uuid is the same as one that is already in the system, this is very very unlicky to happen
      res.status(500).json({created: 'bad'}) 
    }

  }
  else {
    // if the client has not provided the need feild
    res.status(400).json({created: 'bad'})
  }

});

app.post('/conference/update',function (req, res) {

  if('conferenceID' in req.body && 'name' in req.body) {

    // Create a SQL query to create a new event object in the database
    let query = "UPDATE event SET name = " + connection.escape(req.body.name) + "WHERE EventID = '" + req.body.conferenceID + "'"
    try {
      connection.query(query, function (error, results, fields) { 
        if (error) throw error;

        if(results.length === 0) {
          res.status(202).json({updated: 'no',exists: 'no', conferenceID: req.body.conferenceID})
        }
        else{
          // returns that the conference was created
          res.status(202).json({updated: 'good',exists: 'yes', conferenceID: req.body.conferenceID})
        }

      });

      
    } catch (error) {
      // returns if there is an error with the sql query
      // this may happen if uuid is the same as one that is already in the system, this is very very unlicky to happen
      res.status(500).json({updated: 'bad'}) 
    }

  }
  else {
    // if the client has not provided the need feild
    res.status(400).json({updated: 'bad'})
  }

});

app.post('/conference/remove',function (req, res) {

    if('conferenceID' in req.body) {
  
      // Create a SQL query to create a new event object in the database
      let query = "DELETE FROM event WHERE EventID = " + connection.escape(req.body.conferenceID)
      try {
        connection.query(query, function (error, results, fields) { 
          if (error) throw error;
  
          res.status(202).json({removed: 'good', conferenceID: req.body.conferenceID})
  
        });
  
        
      } catch (error) {
        // returns if there is an error with the sql query
        // this may happen if uuid is the same as one that is already in the system, this is very very unlicky to happen
        res.status(500).json({removed: 'bad', conferenceID: req.body.conferenceID})
      }
  
    }
    else {
      // if the client has not provided the need feild
      res.status(400).json({removed: 'bad', conferenceID: req.body.conferenceID})
    }

});

app.post('/conference/data',function (req, res) {

  if('conferenceID' in req.body) {

    // Create a SQL query to create a new event object in the database
    let query = "SELECT * FROM event WHERE EventID = " + connection.escape(req.body.conferenceID)
    try {
      connection.query(query, function (error, results, fields) { 
        if (error) throw error;

        if(results.length === 1) {
          res.status(202).json({results: 'yes',data: {name: results[0].name}, conferenceID: req.body.conferenceID})
        }
        else{
          // returns that the conference was created
          res.status(202).json({results: 'no', conferenceID: req.body.conferenceID})
        }

      });

      
    } catch (error) {
      // returns if there is an error with the sql query
      // this may happen if uuid is the same as one that is already in the system, this is very very unlicky to happen
      res.status(500).json({results: 'no'}) 
    }

  }
  else {
    // if the client has not provided the need feild
    res.status(400).json({results: 'bad'})
  }

});

// addeds a user to a list
app.post('/conference/attendees/add', async function (req, res) {
  if('users' in req.body && 'conferenceID' in req.body) {

    let unsuccessful = []
    let successful = []

    for(var i = 0; i < req.body.users.length; i++) {
      
      try {

        let query = "INSERT INTO attendees (UserID,EventID) VALUES (" + connection.escape(req.body.users[i]) + "," + connection.escape(req.body.conferenceID) + ")"
      
        connection.query(query, function (error, results, fields) { 

          if(error != null){
            if(error.code==='ER_DUP_ENTRY') {
              //fine keep going
              //unsuccessful.push(req.body.users[i])
            }
            else {
              // an error other then dup entry throw error
              console.log(error)
            }
          }
        });
        
      } catch (error) {
        
      }

    }

    res.status(202).json({done: 'yes'})

  }
});

// remove user from the attendees at a event
app.post('/conference/attendees/remove',function (req, res) {
  if('users' in req.body && 'conferenceID' in req.body) {

    let unsuccessful = []
    let successful = []

    for(var i = 0; i < req.body.users.length; i++) {
      
      try {

        let query = "DELETE FROM attendees WHERE UserID =" + connection.escape(req.body.users[i]) + " AND EventID =" + connection.escape(req.body.conferenceID)
      
        connection.query(query, function (error, results, fields) { 

        });
        
      } catch (error) {
        console.log(error)
      }

    }
    
    res.status(202).json({done: 'yes'})
  }

});

// gets a list of attendees at an event
app.post('/conference/attendees',auth,function (req, res) {

  if('conferenceID' in req.body){
      try {

        let query = "SELECT users.UserID, users.email, users.name, attendees.EventID users FROM attendees JOIN users ON attendees.UserID = users.UserID WHERE EventID = " + connection.escape(req.body.conferenceID)
        
          connection.query(query, function (error, results, fields) { 
            let attendees = []

            for(var i = 0; i < results.length; i++) {
              attendees[i] = {UserID: results[i].UserID, name: results[i].name}
            }

            res.status(200).json({attendees: attendees})
          });
        
      } catch (error) {
        res.status(500).send()
    }
  }
  else {
    res.status(400).send()
  }

});

// gets a list of confernces that the user has access too.
app.post('/user/conferences',auth,function (req, res) {
    
    try {

      let query = "SELECT * FROM attendees JOIN event ON attendees.EventID = event.EventID WHERE UserID = " + connection.escape(req.userID)
      
        connection.query(query, function (error, results, fields) { 
          let events = []

          for(var i = 0; i < results.length; i++) {
            events[i] = {EventID: results[i].EventID, name: results[i].name}
          }

          res.status(200).json({events: events})
        });
      
    } catch (error) {
      res.status(500).send()
    }

});

app.get('/presentation/poster/upload', (req, res) => {
  console.log(req)
  res.status(200).send()
});