const posts = require('../models/posts');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class Posts {
    getAll(page, cb) {
        posts.getAll(page, cb);
    }

    count(cb) {
        posts.countall(cb);
    }

    addNew(req, res) {

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

        upload(req, res, function(err) {
            if (err) {
                console.log(err);
            } else {
                if (req.file) {
                    req.body.mainpic = {};
                    req.body.mainpic.url = '/uploads/' + req.file.filename;
                    req.body.mainpic.source = req.body.source;
                    req.body.mainpic.license = req.body.license;
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
                        	})
                        }

                    });

            }
        });

    }
}

module.exports = new Posts();