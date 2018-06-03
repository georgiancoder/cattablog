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
        licenselink: String,
        sourcelink: String,
    },
    slug: {
        en: {type: String},
        ka: {type: String},
        ru: {type: String}
    },
    createdate: {type: Date, default: Date.now},
    author: String,
    views: [],
    catIds: [],
    hide: {type: Boolean, default: false}
});


module.exports = mongoose.model("blogpost", blogpostSchema);


module.exports.addNew = function (data, cb) {
    let post = this;
    let newPost = new post();
    (data.mainpic) ? newPost.mainpic = data.mainpic : newPost.mainpic = {};
    let categorieIds = [];
    categorieIds = categorieIds.concat(data.categories);
    let slug = data.title.replace(/ /g, '-');
    newPost.title = {
        ru: data.title
    };
    newPost.desc = {
        ru: data.desc
    };
    newPost.content = {
        ru: data.content
    };
    newPost.author = data.author;
    newPost.slug = {
        ru: slug
    };
    newPost.hide = data.hide ? true : false;
    newPost.catIds = categorieIds;

    newPost.save(cb);

};

module.exports.updatePost = function (data, cb) {
    let post = this;
    let categorieIds = [];
    let slug = data.title.replace(/ /g, '-');
    categorieIds = categorieIds.concat(data.categories);
    post.findByIdAndUpdate(data.id,{
        title: {
            ru: data.title
        },
        desc: {
            ru: data.desc
        },
        content: {
            ru: data.content
        },
        author: data.author,
        slug: {
            ru: slug
        },
        hide: data.hide ? true : false,
        catIds: categorieIds,
        mainpic: data.mainpic
    },cb);
};

module.exports.random = function(cb){
  let post = this;

  post.countall((err, count)=>{
      if(err){
          console.log(err);
      } else {
        let rand = (Math.floor(Math.random() * (count - 10))) > 0 ? Math.floor(Math.random() * (count - 10)) : 0;
        post.find({hide: false},cb).skip(rand).limit(10);
      }
  })
};

module.exports.getAll = function (page, cb) {
    let post = this;
    post.find(cb).skip(page * 8).sort({createdate: -1}).limit(8);
};

module.exports.getById = function (id, cb) {
    let post = this;
    post.findById(id, cb);
};

module.exports.removePost = function (id, cb) {
    let post = this;
    post.findByIdAndRemove(id, cb);
};

module.exports.countall = function (cb) {
    let post = this;
    post.count(cb);
};

module.exports.updateMainPic = function (id, cb) {
    let post = this;
    post.findByIdAndUpdate(id, {"mainpic.url": ""}, cb);
};