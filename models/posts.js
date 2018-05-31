const mongoose = require('mongoose');

const blogpostSchema = mongoose.Schema({
  title: {
    en: String,
    ka: String,
    ru: String
  },
  desc: {
    en: String,
    ka: String,
    ru: String
  },
  content: {
    en: String,
    ka: String,
    ru: String
  },
  mainpic: {
    url: String,
    source: String,
    sourcelink: String,
    licensetype: String,
    licenselink: String
  },
  slug: {
    en: { type: String},
    ka: { type: String},
    ru: { type: String}
  },
  createdate: { type: Date, default: Date.now },
  author: String,
  views: [],
  catIds: [],
  hide: {type: Boolean, default: false }
});


module.exports = mongoose.model("blogpost",blogpostSchema);


module.exports.getAll = function(cb){
	let post = this;
	post.find(cb);
}