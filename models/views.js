const mongoose = require('mongoose');

const viewsSchema = mongoose.Schema({
	postId: {type: String, unique: true},
	views: {type: Number, default: 0}
});

module.exports = mongoose.model('views',viewsSchema);

module.exports.increase = function(id,cb){
	let view  = this;
	view.find({postId: id},(err,v)=>{
		if(err){
			console.log(err);
		} else {
			if(v && v.length > 0){
				view.update({postId: id},{$inc: {views: 1} },cb);
			}else{
				let newview = new view();
				newview.postId = id;
				newview.save(cb);	
			}			
		}
	});
}