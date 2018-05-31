const posts = require('../models/posts');

class Posts {
	getAll(cb){
		posts.getAll(cb);
	}
}

module.exports = new Posts();