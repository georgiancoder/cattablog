const express = require('express')
const path = require('path')
const config = require('./config');
const mainRouter = require('./routes/main');
const adminRouter = require('./routes/admin');
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');


mongoose.connect(config.mongo);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('vaja'));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/',mainRouter);
app.use('/admin',adminRouter);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
