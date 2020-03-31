var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');


router.get('/', function (req, res, next) {

	res.redirect('/login');

});


/*
Admin logic controller starts here 
*/

// GET: Admin dashboard pages, e.g: /admin/index, /admin/records, ...etc. 

router.get('/admin/:page', function (req, res, next) {

	var page = req.params.page;

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		//	console.log("admin data");
		//	console.log(data);
		if (!data || data.role != 1) {
			res.redirect('/login');
		} else {

			// Choose what UI to view based on page variable  
			switch (page) {
				case "index":
					res.render('ui/admin/index.vash', { title: "Home Page", username: data.username });
					break;
				case "users":
					res.render("ui/admin/users.vash", { title: "System Users", username: data.username });
					break;
				case "user":
					res.render("ui/admin/user.vash", { title: "User Profile", username: data.username });
					break;
				case "schedule":
					res.render("ui/admin/schedule.vash", { title: "Staff Schedule", username: data.username });
					break;
				case "cases":
					res.render("ui/admin/cases.vash", { title: "Cases", username: data.username });
					break;
				case "pharmacy":
					res.render("ui/admin/pharmacy.vash", { title: "Pharmacy", username: data.username });
					break;
				case "departments":
					res.render("ui/admin/departments.vash", { title: "Departments", username: data.username });
					break;
				case "records":
					res.render("ui/admin/records.vash", { title: "Records", username: data.username });
					break;
				case "message":
					res.render("ui/admin/message.vash", { title: "Send Message", username: data.username });
					break;
				case "recovery":
					res.render("ui/admin/recovery.vash", { title: "Recovery", username: data.username });
					break;
				case "logout":
					res.redirect("../logout");
					break;
				default:
					break;
			}

		}
	});


});



// Admin API 

router.post('/admin/api/:operation', function (req, res, next) {



	var operation = req.params.operation; // Get the admin operation 

	// Check if user is Admin 

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log(data);
		if (!data || data.role != 1) {
			return res.json({ error: "Unauthorized to access this area!" });
		}
	});

	// Admin operation triggers a function with the same name as the operation

	switch (operation) {
		case "newUser":
			newUser();
			break;
		case "getUser":
			getUser();
			break;
		case "getUsers":
			getUsers();
			break;
		case "updateUser":
			updateUser();
			break;
		case "systemRecover":
			systemRecover();
			break;
		default:
			break;
	}


	// Admin functions 

	function getUser() {
		var id = parseInt(req.query.id);
		//     console.log(id);
		User.find({ unique_id: id }, function (err, users) {
			if (err) return console.error(err);
			console.log(users);
			res.json(users);
		})


	}

	function getUsers() {

		User.find(function (err, users) {
			if (err) return console.error(err);
			console.log(users);
			res.json(users);
		});

	}

	function updateUser() {
		var id = req.query.id;

		User.findOne({ unique_id: id }, function (err, user) {
			if (err) {
				res.json({ status: 0 });
			} else {
				user.username = req.body.username;
				user.email = req.body.email;
				user.phone = req.body.phone;
				user.bio = req.body.bio;
				user.speciality = req.body.speciality;
				user.accountStatus = req.body.accountStatus;
				user.password = crypto.createHash('md5').update(req.body.password).digest('hex');
				user.save();
				res.send({ "status": "1" });
			}
		});

	}

	function newUser() {

		var personInfo = req.body;
		if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf || !personInfo.role) {
			res.json({ error: "Missing data has been sent!" });
		} else {
			if (personInfo.password == personInfo.passwordConf) {

				User.findOne({ email: personInfo.email }, function (err, data) {

					// Check if the submitted email is used before
					if (!data) {
						var id;
						User.findOne({}, function (err, data) {

							if (data) {
								id = data.unique_id + 1;
							} else {
								id = 1;
							}

							var newPerson = new User({
								unique_id: id,
								email: personInfo.email,
								username: personInfo.username,
								password: crypto.createHash('md5').update(personInfo.password).digest('hex'),
								role: personInfo.role,
								phone: personInfo.phone,
								accountStatus: 1,
								bio: personInfo.bio,
								speciality: personInfo.speciality
							});

							newPerson.save(function (err, Person) {
								if (err)
									console.log(err);
								else
									console.log('Success');
							});

						}).sort({ _id: -1 }).limit(1);
						res.send({ "status": "New user has been added to the system." });
					} else {
						res.send({ "status": "Email is already in use" });
					}

				});
			} else {
				res.send({ "status": "Passwords are not matched" });
			}
		}
	}

	function systemRecover() {
		// TODO: implement system recovery based on ui/admin/recovery.vash form inputs  
		// Source: 

		var masterKey = ''; // Put your masterkey here

		try {
			var data = fs.readFileSync('/opt/backups/records.csv', 'utf8'); // /opt/backups/records.csv is file path 
			var decryptedText = decrypt(masterKey, data);

			fs.writeFile('/opt/backups/records.csv', decryptedText, function (err) {
				if (err) throw err;
				console.log('Done!');
			});

		} catch (e) {
			console.log('Error:', e.stack);
		}

		/*
		DB: eHospital
		Collection: records
		Type: CSV
		File: /opt/backups/records.csv
		*/
		var spawn = require('child_process').spawn;
		ls = spawn('mongoimport', ['--db', 'eHospital', '--collection', 'records', '--type', 'csv', '--file', '/opt/backups/records.csv']);
		
		// Using AES as decryption algorithm

		function decrypt(key, text) {
			var decipher = crypto.createDecipher('aes-256-cbc', key)
			var dec = decipher.update(text, 'hex', 'utf8')
			dec += decipher.final('utf8');
			return dec;
		}



	}

});



/*
Admin logic controller ends here 
*/





/*
Doctor logic controller starts here 
*/

// GET: Doctor dashboard pages, e.g: /doctor/index, /doctor/records, ...etc. 

router.get('/doctor/:page', function (req, res, next) {

	var page = req.params.page;

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		//	console.log("doctor data");
		//	console.log(data);
		if (!data || data.role != 2) {
			res.redirect('/login');
		} else {

			// Choose what UI to view based on page variable  
			switch (page) {
				case "index":
					res.render('ui/doctor/index.vash', { title: "Home Page", username: data.username });
					break;
				case "schedule":
					res.render("ui/doctor/schedule.vash", { title: "Staff Schedule", username: data.username });
					break;
				case "cases":
					res.render("ui/doctor/cases.vash", { title: "Cases", username: data.username });
					break;
				case "records":
					res.render("ui/doctor/records.vash", { title: "Records", username: data.username });
					break;
				case "message":
					res.render("ui/doctor/message.vash", { title: "Send Message", username: data.username });
					break;
				case "logout":
					res.redirect("../logout");
					break;
				default:
					break;
			}

		}
	});


});



// Doctor API 

router.post('/doctor/api/:operation', function (req, res, next) {

	var operation = req.params.operation; // Get the doctor operation 

	// Check if user is Doctor 

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log(data);
		if (!data || data.role != 2) {
			return res.json({ error: "Unauthorized to access this area!" });
		}
	});

	// Doctor operations case triggers function with the same name 

	switch (operation) {
		case "addNewCase":
			// addNewCase();
			break;
		case "assignCase":
			// assignCase();
			break;
		case "sendMessage":
			// sendMessage();
			break;
		case "readRecord":
			// readRecord();
			break;
		case "changeAssignment":
			// changeAssignment();
			break;
		default:
			break;
	}


	// Doctor functions 

	function addNewCase() { }
	function assignCase() { }
	function sendMessage() { }
	function readRecord() { }
	function changeAssignment() { }

});



/*
Doctor logic controller ends here 
*/



/*
Receptionist logic controller starts here 
*/

// GET: Receptionist dashboard pages, e.g: /receptionist/index, /receptionist/records, ...etc. 

router.get('/receptionist/:page', function (req, res, next) {

	var page = req.params.page;

	User.findOne({ unique_id: req.session.userId }, function (err, data) {

		if (!data || data.role != 3) {
			res.redirect('/login');
		} else {

			// Choose what UI to view based on page variable  
			switch (page) {
				case "index":
					res.render('ui/receptionist/index.vash', { title: "Home Page", username: data.username });
					break;
				case "schedule":
					res.render("ui/receptionist/schedule.vash", { title: "Staff Schedule", username: data.username });
					break;
				case "cases":
					res.render("ui/receptionist/cases.vash", { title: "Cases", username: data.username });
					break;
				case "check":
					res.render("ui/receptionist/check.vash", { title: "Check in-out", username: data.username });
					break;
				case "message":
					res.render("ui/receptionist/message.vash", { title: "Send Message", username: data.username });
					break;
				case "logout":
					res.redirect("../logout");
					break;
				default:
					break;
			}

		}
	});


});



// Receptionist API 

router.post('/receptionist/api/:operation', function (req, res, next) {

	var operation = req.params.operation; // Get the receptionist operation 

	// Check if user is receptionist 

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log(data);
		if (!data || data.role != 2) {
			return res.json({ error: "Unauthorized to access this area!" });
		}
	});

	// receptionist operation triggers function with the same name as the operation

	switch (operation) {
		case "addNewCase":
			// addNewCase();
			break;
		case "checkInOut":
			// checkInOut();
			break;
		case "sendMessage":
			// sendMessage();
			break;
		case "changeAssignment":
			// changeAssignment();
			break;
		default:
			break;
	}


	// Receptionist functions 

	function addNewCase() { }
	function checkInOut() { }
	function sendMessage() { }
	// function ...
});



/*
Receptionist logic controller ends here 
*/



/*
Pharmacist logic controller starts here 
*/

// GET: Pharmacist dashboard pages, e.g: /pharmacist/index, /pharmacist/records, ...etc. 

router.get('/pharmacist/:page', function (req, res, next) {

	var page = req.params.page;

	User.findOne({ unique_id: req.session.userId }, function (err, data) {

		if (!data || data.role != 4) {
			res.redirect('/login');
		} else {

			// Choose what UI to view based on page variable  
			switch (page) {
				case "index":
					res.render('ui/pharmacist/index.vash', { title: "Home Page", username: data.username });
					break;
				case "schedule":
					res.render("ui/pharmacist/schedule.vash", { title: "Staff Schedule", username: data.username });
					break;
				case "cases":
					res.render("ui/pharmacist/cases.vash", { title: "Cases", username: data.username });
					break;
				case "pharmacy":
					res.render("ui/pharmacist/pharmacy.vash", { title: "Pharmacy", username: data.username });
					break;
				case "message":
					res.render("ui/pharmacist/message.vash", { title: "Send Message", username: data.username });
					break;
				case "logout":
					res.redirect("../logout");
					break;
				default:
					break;
			}

		}
	});


});



// Pharmacist API 

router.post('/pharmacist/api/:operation', function (req, res, next) {

	var operation = req.params.operation; // Get the pharmacist operation 

	// Check if user is pharmacist 

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log(data);
		if (!data || data.role != 4) {
			return res.json({ error: "Unauthorized to access this area!" });
		}
	});

	// pharmacist operation triggers function with the same name as the operation

	switch (operation) {
		case "addNewDrug":
			// addNewDrug();
			break;
		case "updateDrug":
			// updateDrug();
			break;
		case "sendMessage":
			// sendMessage();
			break;
		case "reportDrug":
			// reportDrug();
			break;
		default:
			break;
	}


	// Receptionist functions 

	function addNewDrug() { }
	function updateDrug() { }
	function sendMessage() { }
	function reportDrug() { }
	// function ...
});




//pharmacist logic controller ends here 





// System login logic 


router.get('/login', function (req, res, next) {

	User.findOne({ unique_id: req.session.userId }, function (err, data) {

		// console.log(data);

		// Check if user is logged in or not 

		if (!data) {
			// not logged in show login form 
			res.sendFile(path.join(__dirname, '../views', 'login.html'));
		} else {

			//Logged in check which ui to show 

			switch (data.role) {
				case 1:
					res.redirect('/admin/index');
					break;
				case 2:
					res.redirect('/doctor/index');
					break;
				case 3:
					res.redirect('/receptionist/index');
					break;
				case 4:
					res.redirect('/pharmacist/index');
					break;
				default:
					break;
			}

		}
	});



});


router.post('/login', function (req, res) {

	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			var userHashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
			userHashedPassword = userHashedPassword.replace(/\s+/g, "");
			data.password = data.password.replace(/\s+/g, "");
		//	console.log(data.password === userHashedPassword);
			if (data.password == userHashedPassword) {
				req.session.userId = data.unique_id;

				switch (data.role) {
					case 1:
						res.redirect('/admin/index');
						break;
					case 2:
						res.redirect('/doctor/index');
						break;
					case 3:
						res.redirect('/receptionist/index');
						break;
					case 4:
						res.redirect('/pharmacist/index');
						break;
					default:
						break;
				}


			} else {
				// error 1 wrong password 
				res.redirect('login?error=1');
			}
		} else {
			// error 2 wrong email 

			res.redirect('login?error=2');
		}
	});
});



router.get('/logout', function (req, res, next) {


	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/login');
			}
		});
	} else {
		res.redirect('/login');

	}
});



router.get('/forget', function (req, res) {
	res.sendFile(path.join(__dirname, '../views', 'forget.html'));
});



router.post('/forget', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);

	User.findOne({ email: req.body.email }, function (err, data) {
		//console.log(data);
		if (!data) {
			res.redirect('/forget?error=1');
		} else {

			// TODO: implement password reset logic here 
		}
	});

});

module.exports = router;