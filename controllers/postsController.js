const posts = require('../models/posts');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class Posts {
    getAll(page, cb) {
        posts.getAll(page, cb);
    }

    randomPosts(cb){
        posts.random(cb);
    }

    count(cb) {
        posts.countall(cb);
    }

    uploadmainpic(req,res,cb){
        let storage = multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, './public/uploads');
            },
            filename: function(req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + file.originalname);
            }
        });

        let upload = multer({
            storage: storage,
            limits: { fileSize: 4 * 1024 * 1024 },
            fileFilter: function(req, file, cb) {
                if (path.extname(file.originalname) !== ".png" && path.extname(file.originalname) !== ".jpg" && path.extname(file.originalname) !== ".jpeg") {
                    return cb(new Error('only png or jpg'));
                }
                cb(null, true);
            }
        }).single('mainpic');

        upload(req, res, (err) => {
            cb(err);
        });
    }

    addNew(req, res) {
        this.uploadmainpic(req,res,(err)=>{
            if (err) {
                console.log(err);
            } else {
                if (req.file) {
                    req.body.mainpic = {};
                    req.body.mainpic.url = '/uploads/' + req.file.filename;
                    req.body.mainpic.sourcelink = req.body.source;
                    req.body.mainpic.licenselink = req.body.license;
                } else {
                    req.body.mainpic = {};
                    req.body.mainpic.url = '';
                    req.body.mainpic.sourcelink = req.body.source;
                    req.body.mainpic.licenselink = req.body.license;
                }

                req.checkBody('title', 'title is required').notEmpty();
                req.checkBody('desc', 'Description is required');
                req.getValidationResult()
                    .then((result) => {
                        if (!result.isEmpty()) {
                            res.json(result.array());
                        } else {
                            posts.addNew(req.body,(err,data)=>{
                                if(err){
                                    console.log(err);
                                } else {
                                    res.redirect('/admin/addpost');
                                }
                            });
                        }

                    });

            }
        });
    }

    updatePost(req,res){
        this.uploadmainpic(req,res,(err)=>{
            if (err) {
                console.log(err);
            } else {
                if (req.file) {
                    req.body.mainpic = {};
                    req.body.mainpic.url = '/uploads/' + req.file.filename;
                    req.body.mainpic.sourcelink = req.body.source;
                    req.body.mainpic.licenselink = req.body.license;
                } else {
                    req.body.mainpic = {};
                    req.body.mainpic.url = req.body.mainpicurl ? req.body.mainpicurl : '';
                    req.body.mainpic.sourcelink = req.body.source;
                    req.body.mainpic.licenselink = req.body.license;
                }
                req.checkBody('id','post id is required').notEmpty();
                req.checkBody('title', 'title is required').notEmpty();
                req.checkBody('desc', 'Description is required');
                req.getValidationResult()
                    .then((result) => {
                        if (!result.isEmpty()) {
                            res.json(result.array());
                        } else {
                            posts.updatePost(req.body,(err,data)=>{
                                if(err){
                                    console.log(err);
                                } else {
                                    res.redirect('/admin/editpost/' + data._id);
                                }
                            });
                        }

                    });

            }
        });
    }

    deletePost(req,res){
        req.checkBody('id','id is required').notEmpty();
        req.getValidationResult().then(result =>{
            if(!result.isEmpty()){
                res.json(result.array());
            }else{
                posts.removePost(req.body.id,(err,post)=>{
                    if(err){
                        console.log(err);
                    } else {
                        if (post.mainpic.url.length > 0 && fs.existsSync(`public${post.mainpic.url}`)) {
                            fs.unlink(`public${post.mainpic.url}`, (err)=>{
                                if(err){
                                    console.log(err);
                                }else {
                                    res.json({success: true});
                                }
                            });
                        } else {
                            res.json({success: true});
                        }
                    }
                });
            }
        })
    }

    getPostById(id,cb){
        if(id){
            posts.getById(id,cb);
        }
    }

    deleteMainPic(id,cb){
        if (id) {
            posts.updateMainPic(id,(err,data)=>{
               if(err){
                   console.log(err);
               } else {
                   if (data.mainpic.url.length > 0 && fs.existsSync(`public${data.mainpic.url}`)) {
                       fs.unlink(`public${data.mainpic.url}`, cb);
                   } else {
                       cb(null);
                   }
               }
            });
        } else {
            console.log('no data to delete');
        }
    }
}

module.exports = new Posts();