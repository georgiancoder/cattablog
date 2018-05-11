const mongoose = require('mongoose');

const adminUsersSchema = mongoose.Schema({
	name: String,
	lastName: String,
	username: {type: String, unique: true},
	password: String,
	dateCreated: {type: Date, default: new Date()}
});

module.exports = mongoose.model('adminUsers',adminUsersSchema);

module.exports.checkUser = function(username,cb){
	let user = this;
	user.findOne({username: username},cb);
}
