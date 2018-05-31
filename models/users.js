const mongoose = require('mongoose');


const adminUsersSchema = mongoose.Schema({
	name: String,
	lastName: String,
	username: {type: String, unique: true},
	password: String,
	role: {type: Number, default: 2 },
	dateCreated: {type: Date, default: new Date()}
});


module.exports = mongoose.model('users',adminUsersSchema);

module.exports.checkUser = function(username,cb){
	let user = this;
	user.findOne({username: username},cb);
}


module.exports.addNewUser = function(data,cb){
	let user = this;

	let newUser = new user();

	newUser.name = data.name;
	newUser.lastName = data.lastname;
	newUser.username = data.email;
	newUser.password = data.password;

	newUser.save(cb);
}