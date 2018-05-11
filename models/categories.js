const mongoose = require('mongoose');

const categorieSchema = mongoose.Schema({
	title: String,
	order: {type: Number, default: 0}
});

module.exports = mongoose.model('categories',categorieSchema);

module.exports.getCategories = function(cb){
	let categorie = this;
	categorie.find(cb).sort('order');
}

module.exports.getCategoryById = function(id,cb){
	let categorie = this;
	categorie.findById(id,cb);
}

module.exports.addNewCategorie = function(data,cb){
	let categorie = this;
	let newCategorie = new categorie();
	newCategorie.title = data.title;
	newCategorie.order = data.order;

	newCategorie.save(cb);
}

module.exports.search = function(patt,cb){
	let categorie = this;
	let pattern = new RegExp(patt);
	categorie.find({"title": pattern},cb);
}

module.exports.updateCategorie = function(data,cb){
	let categorie = this;
	categorie.findByIdAndUpdate(data.id,{
		title: data.title,
		order: data.order
	},cb);
}

module.exports.removeCategorie = function(id,cb){
	let categorie = this;
	categorie.findByIdAndRemove(id,cb);
}
