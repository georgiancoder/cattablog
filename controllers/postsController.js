const posts = require('../models/posts');
const views = require('../models/views');
const multer = require('multer');
const GoogleCloudStorage = require('@google-cloud/storage');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const BUCKET_NAME = 'cattablog';

class Posts {
    getAll(page, cb) {
        posts.getAll(page, cb);
    }

    getPopular(cb) {
        views.popular(cb);
    }

    getAllPost(page, cb) {
        posts.getAllPost(page, cb);
    }

    randomPosts(cb) {
        posts.random(cb);
    }

    search(page, pattern, cb) {
        pattern = pattern ? pattern : '';
        posts.search(page, pattern, cb);
    }

    count(cb) {
        posts.countall(cb);
    }

    uploadmainpic(req, res, cb) {

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

        let form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            let body = {};
            body.title = fields.title;
            body.desc = fields.desc;
            body.author = fields.author;
            body.content = fields.content;
            body.categories = fields.categories;
            body.hide = fields.hide;
            if (files.mainpic.size > 0) {
                let path = files.mainpic.path;
                let filename = new Date().getTime() + files.mainpic.name;
                let gcstorage = GoogleCloudStorage({
                    projectId: 'cattablog-206608',
                    keyFilename: './config/cattablog-keyfile.json'
                });
                let cattaBucket = gcstorage.bucket(BUCKET_NAME);
                const blob = cattaBucket.file(filename);
                fs.createReadStream(path)
                    .pipe(blob.createWriteStream())
                    .on('error', function(err) {})
                    .on('finish', function() {
                        // The file upload is complete.
                        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
                        body.mainpic = {};
                        body.mainpic.url = publicUrl;
                        body.mainpic.sourcelink = fields.source;
                        body.mainpic.licenselink = fields.license;
                        if (fields.title && fields.title.length > 0 && fields.desc && fields.desc.length > 0) {
                            posts.addNew(body, (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.redirect('/admin/addpost');
                                }
                            });
                        } else {
                            res.json({ errors: 'title and  description is required' });
                        }
                    });
            } else {
                body.mainpic = {};
                body.mainpic.url = '';
                body.mainpic.sourcelink = fields.source;
                body.mainpic.licenselink = fields.license;
                if (fields.title && fields.title.length > 0 && fields.desc && fields.desc.length > 0) {
                    posts.addNew(body, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/admin/addpost');
                        }
                    });
                } else {
                    res.json({ errors: 'title and  description is required' });
                }
            }

        });
    }

    updatePost(req, res) {
        // this.uploadmainpic(req, res, (err) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         if (req.file) {
        //             req.body.mainpic = {};
        //             req.body.mainpic.url = '/uploads/' + req.file.filename;
        //             req.body.mainpic.sourcelink = req.body.source;
        //             req.body.mainpic.licenselink = req.body.license;
        //         } else {
        //             req.body.mainpic = {};
        //             req.body.mainpic.url = req.body.mainpicurl ? req.body.mainpicurl : '';
        //             req.body.mainpic.sourcelink = req.body.source;
        //             req.body.mainpic.licenselink = req.body.license;
        //         }
        //         req.checkBody('id', 'post id is required').notEmpty();
        //         req.checkBody('title', 'title is required').notEmpty();
        //         req.checkBody('desc', 'Description is required');
        //         req.getValidationResult()
        //             .then((result) => {
        //                 if (!result.isEmpty()) {
        //                     res.json(result.array());
        //                 } else {
        //                     posts.updatePost(req.body, (err, data) => {
        //                         if (err) {
        //                             console.log(err);
        //                         } else {
        //                             res.redirect('/admin/editpost/' + data._id);
        //                         }
        //                     });
        //                 }

        //             });

        //     }
        // });

        let form = new formidable.IncomingForm();
        let properfields = {};
        form.on('field', function(name, value) {
            if (!properfields[name]) {
                properfields[name] = value;
            } else {
                if (properfields[name].constructor.toString().indexOf("Array") > -1) { // is array
                    properfields[name].push(value);
                } else { // not array
                    var tmp = properfields[name];
                    properfields[name] = [];
                    properfields[name].push(tmp);
                    properfields[name].push(value);
                }
            }
            console.log(properfields);
        });

        

        form.parse(req, function(err, fields, files) {
            console.log(fields);
            let body = {};
            body.title = fields.title;
            body.id = fields.id;
            body.desc = fields.desc;
            body.author = fields.author;
            body.content = fields.content;
            body.categories = fields.categories;
            body.hide = fields.hide;
            if (files.mainpic && files.mainpic.size > 0) {
                let path = files.mainpic.path;
                let filename = new Date().getTime() + files.mainpic.name;
                let gcstorage = GoogleCloudStorage({
                    projectId: 'cattablog-206608',
                    keyFilename: './config/cattablog-keyfile.json'
                });
                let cattaBucket = gcstorage.bucket(BUCKET_NAME);
                const blob = cattaBucket.file(filename);
                fs.createReadStream(path)
                    .pipe(blob.createWriteStream())
                    .on('error', function(err) {})
                    .on('finish', function() {
                        // The file upload is complete.
                        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
                        body.mainpic = {};
                        body.mainpic.url = publicUrl;
                        body.mainpic.sourcelink = fields.source;
                        body.mainpic.licenselink = fields.license;
                        if (fields.title && fields.title.length > 0 && fields.desc && fields.desc.length > 0) {
                            posts.updatePost(body, (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.redirect('/admin/editpost/' + data._id);
                                }
                            });
                        } else {
                            res.json({ errors: 'title and  description is required' });
                        }
                    });
            } else {
                body.mainpic = {};
                body.mainpic.url = fields.mainpicurl ? fields.mainpicurl : '';
                body.mainpic.sourcelink = fields.source;
                body.mainpic.licenselink = fields.license;
                if (fields.title && fields.title.length > 0 && fields.desc && fields.desc.length > 0) {
                    posts.updatePost(body, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/admin/editpost/' + data._id);
                        }
                    });
                } else {
                    res.json({ errors: 'title and  description is required' });
                }
            }

        });
    }

    deletePost(req, res) {
        req.checkBody('id', 'id is required').notEmpty();
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.json(result.array());
            } else {
                posts.removePost(req.body.id, (err, post) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (post.mainpic && post.mainpic.url.length > 0) {
                            let filename = post.mainpic.url.match(/\/[^/]*$/)[0].substr(1);
                            let gcstorage = GoogleCloudStorage({
                                projectId: 'cattablog-206608',
                                keyFilename: './config/cattablog-keyfile.json'
                            });
                            gcstorage
                                .bucket(BUCKET_NAME)
                                .file(filename)
                                .delete()
                                .then(() => {
                                    console.log('file deleted');
                                    res.json({ success: true });
                                })
                                .catch(err => {
                                    console.error('ERROR:', err);
                                });
                        } else {
                            res.json({ success: true });
                        }
                    }
                });
            }
        })
    }

    increaseView(id, cb) {
        if (id) {
            views.increase(id, cb);
        }
    }

    getPostById(id, cb) {
        if (id) {
            posts.getById(id, cb);
        }
    }

    getPostData(id, cb) {
        if (id) {
            posts.postData(id, cb);
        }
    }

    getPostByCategorie(page, catId, cb) {
        if (catId) {
            posts.getPostsByCat(page, catId, cb);
        }
    }

    deleteMainPic(id, filename, cb) {
        if (id && filename) {
            posts.updateMainPic(id, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    let gcstorage = GoogleCloudStorage({
                        projectId: 'cattablog-206608',
                        keyFilename: './config/cattablog-keyfile.json'
                    });
                    gcstorage
                        .bucket(BUCKET_NAME)
                        .file(filename)
                        .delete()
                        .then(() => {
                            cb(null);
                        })
                        .catch(err => {
                            cb(err);
                        });
                }
            });
        } else {
            console.log('no data to delete');
        }
    }
}

module.exports = new Posts();