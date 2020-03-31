var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');



mongoose.connect('mongodb://localhost/eHospital', { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

  User.count({}, function (error, numOfDocs) {

    if (numOfDocs === 0) {
      try {
        User.insertMany([
          { "_id": "5e78ddf0a1d2f218d83cf3a6", "unique_id": 2, "email": "admin@admin.com", "username": "Abdullah Hussam", "password": "e10adc3949ba59abbe56e057f20f883e", "role": 1, "phone": "0781734123", "accountStatus": 1, "bio": "A good doctor Wallah!", "speciality": "Dermatologist", "__v": 0 },
          { "_id": "5e7a0211fc2b4d4e586c39cd", "unique_id": 3, "email": "doctor@doctor.com", "username": "Ali Moahmmed", "password": "e10adc3949ba59abbe56e057f20f883e", "role": 2, "speciality": "Surgery", "__v": 0 },
          { "_id": "5e834d1c21691453304ed320", "unique_id": 4, "email": "receptionist@receptionist.com", "username": "Hussien Ali", "password": "e10adc3949ba59abbe56e057f20f883e", "role": 3, "phone": "0781734123", "accountStatus": 1, "bio": "", "speciality": "n/a", "__v": 0 },
          { "_id": "5e836a3721691453304ed321", "unique_id": 5, "email": "pharmacist@pharmacist.com", "username": "Qasim Abdullsamad", "password": "e10adc3949ba59abbe56e057f20f883e", "role": 4, "phone": "0781734123", "accountStatus": 1, "bio": "", "speciality": "n/a", "__v": 0 }
        ]
        );
      } catch (e) {
        print(e);
      }

    }


  });


});

app.use(session({
  secret: 'veryrandom12u8uqe[rj[^@#$!@#%#$^%^&!@$#!QWFSDHGDVFCAXCBVCE!@e1dasndjashdhvbi2p3yb84yv182y387y12vb1c', // Change on deploy 
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));





app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "vash")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});