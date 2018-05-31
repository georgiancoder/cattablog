const posts = require('../models/posts');

class Posts {
	getAll(page,cb){
		posts.getAll(page,cb);
	}

	count(cb){
		posts.countall(cb);
	}
}

module.exports = new Posts();