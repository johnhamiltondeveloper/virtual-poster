const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')


function initialize(passport,getUserByEmail){

    const authenticateUser = async (email,password,done) => {

        var user = {}

        // getUserByEmail("admin", (function(result){
        //     var data = result

        //     return function() {
        //         console.log(data)
        //         user = data
        //     }
        // })());  

        console.log(user)

        if(user.email == null) {
            return done(null,false, {message: "no user with this email"})
        }

        try {
            if(bcrypt.compare(password,user.password)) {
                return done(null, user);
                console.log("login")
            }
            else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        }
        catch(err){
            return done(err)
        }
        
    }

    passport.serializeUser((user,done) => {})
    passport.deserializeUser((id,done) => {})

    passport.use(new LocalStrategy({usernameField: 'email',passwordField: 'password'},authenticateUser))
}

module.exports = initialize