const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');
const bcrypt = require('bcrypt-nodejs');


passport.use(new LocalStrategy(
  function(username, password, done) {
  	Users.checkUser(username,(err,user)=>{

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
  Users.findById(id, function(err, user) {
    done(err, user);
  });
});




class User {

	register(req,res){
		req.checkBody('name','name is required').notEmpty();
		req.checkBody('lastname','lastname is required').notEmpty();
		req.checkBody('email','email is required').notEmpty();
		req.checkBody('email','email is not valid').isEmail();
		req.checkBody('password','password required').notEmpty();
		req.checkBody('passconfirm','passwords do not matched').equals(req.body.password);
		req.getValidationResult().then(result=>{
			if(!result.isEmpty()){
	          res.json(result.array());
	        }else{
	        	req.body.password = bcrypt.hashSync(req.body.password);
	        	Users.addNewUser(req.body,(err,data)=>{
	        		if(err){
	        			if(err.code == 11000){
	        				res.send('ასეთი email უკვე არსებობს');
	        			}
	        			else {
	        				console.log(err);
	        			}
	        		} else {
	        			res.redirect('/regauth');
	        		}
	        	});
	        }
		});
	}


	adminLogin(req,res,next){
		passport.authenticate('local', (err,user,info)=>{
			if (err) { return next(err); }
		      if (!user) { return res.redirect('/admin'); }
		      req.logIn(user, function(err) {
		        if (err) { return next(err); }
		        if(user.role == 1)
		        	return res.redirect('/admin/dashboard');
		        else
		        	return res.redirect('/')
		      });
		})(req,res,next);
	}

	userLogin(req,res,next){
		passport.authenticate('local', (err,user,info)=>{
			if (err) { return next(err); }
		      if (!user) { return res.redirect('/admin'); }
		      req.logIn(user, function(err) {
		        if (err) { return next(err); }
		        return res.redirect('/');
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
		res.redirect('/regauth');
	}
}

module.exports = new User();
