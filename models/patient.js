var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 patientRecord = new Schema( {
	
	unique_id: Number,
	name: String,
    case: String,
    priority: Number,
	phoneNumber: String,
    bio: String,
    files: String, 
    room : Number,
    assignedTo: Number
});

patientRecord.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.password;
	return obj;
   }

  Patient = mongoose.model('patient', patientRecord);

module.exports = Patient;