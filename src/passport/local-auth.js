const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({'email': email})
  console.log(user)
  if(user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
  console.log(newUser)
    await newUser.save();
    done(null, newUser);
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({email: email});
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  return done(null, user);
}));
//objeto y callback de configuracion

//cuando el usuario se loguee voy a utilizar este modulo
//este modulo recibirá sus datos, crea un nuevo usuario, lo va a guardar
//termina el proceso devolviendo un nulo para err y el usuario registrado

//una vez registrado el usuario, guardaremos sus datos internamente en archivo del navegador
//así no require autenticarse sus datos en cada pagina, todo de manera automatica
//mediante serializar y deserializar



//resumen

//una vez el usuario se authentique termina el proceso
//al terminar el proceso me da los datos del usuario authenticado
// de esos datos solo quiero el id,  el id es lo que estaremos intercambiando entre multiples paginas
//pero esto deberá ser authenticado por el servidor
//el navegador cada vez qeu viaja por una pagina me da el id y cada vez que viaje yo haré consulta a la base de datos para verificar que exista en db
//como el user existe el server devolverá  datos del usuario al navegador, proceso que se repetirá en cada momento.