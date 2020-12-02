const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
require('dotenv').config();

const users = [{
    id: 1,
    username: process.env.SISTEMLOGIN,
    password: process.env.SISTEMPASS
}]


module.exports = function(passport) {

    function findUser(username){
        return users.find(user => user.username === username);
    }

    function findUserById(id){
        return users.find(user => user.id === id);
    }

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        try {
            const user = findUserById(id);
            done(null, user);
        } catch(err){
            done(err, null);
        }
    });
    
    passport.use(new LocalStrategy((username, password, done) => {

        try {
            // buscando usuário no array/banco
            const user = findUser(username)

            // verificando de o usuário foi encontrado no banco/array
            if(!user){return done(null, false, { message: 'Incorrect username.' })};
            // verificando se a senha bate
            if(user.password != password){return done(null, false, { message: 'Incorrect password.' })};

            return done(null, user);
        
        }catch(err) {return done(err, false)};
    }))

    
}


