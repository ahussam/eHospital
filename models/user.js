var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	role: Number,
	speciality: String,
	accountStatus: Number,
	phoneNumber: String,
	bio: String 
});

userSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.password;
	return obj;
   }

User = mongoose.model('User', userSchema);

module.exports = User;