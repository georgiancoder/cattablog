const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/adminUsers');
const bcrypt = require('bcrypt-nodejs');


passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.checkUser(username,(err,user)=>{
  		if(err) {
  			return done(err);
  		}
  		if(!user){
  			return done(null,false,{message: 'Incorrect username'});
  		}
  		if(!bcrypt.compareSync(password, user.password)){
  			return done(null,false, {message: 'Incorrect password'});
  		}
  		return done(null,user);
  	});
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




class adminUser {
	login(req,res,next){
		passport.authenticate('local', (err,user,info)=>{
			if (err) { return next(err); }
		      if (!user) { return res.redirect('/admin'); }
		      req.logIn(user, function(err) {
		        if (err) { return next(err); }
		        return res.redirect('/admin/dashboard');
		      });
		})(req,res,next);
	}

	checkAuth(req,res,next){
		if(req.isAuthenticated()){
			next();
		}else{
			res.redirect('/admin');
		}
	}

	logOut(req,res){
		req.logout();
		res.redirect('/admin');
	}
}

module.exports = adminUser;
