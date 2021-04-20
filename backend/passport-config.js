const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')


function initialize(passport,connection){

    const authenticateUser = async (email,password,done) => {

        var user = {}

        await connection.query('select * from users WHERE email=?',[email], async function (err, results, fields) {
            if (err) throw err;
        
            if(results.length == 0)
            { 
                return done(null,false, {message: "no user with this email"})
            }
            else
            {
                user = {email: results[0].email,password: results[0].password}

                try {
                    const chack = await bcrypt.compare(password,results[0].password)
                    if(chack) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                }
                catch(err){
                    return done(err)
                }
            }
        
          })


        
        
    }

    passport.serializeUser((user,done) => {})
    passport.deserializeUser((id,done) => {})

    passport.use(new LocalStrategy({usernameField: 'email',passwordField: 'password'},authenticateUser))
}

module.exports = initialize