const express = require('express');
const router = express.Router();
const Categorie = require('../controllers/categorieController');
const User = require('../controllers/usersController');
const Posts = require('../controllers/postsController');
const pagination = require('pagination');


// get requests
router.get('/', (req, res) => {
    let opt = {
        page: 'login'
    };
    res.render('admin/login', opt);
});

router.get('/dashboard', User.checkAuth, (req, res) => {
    let opt = {
        page: 'dashboard',
        user: req.user
    };
    res.render('admin/dashboard', opt);
});

router.get('/categories', User.checkAuth, (req, res) => {
    let opt = {
        page: 'categories',
        user: req.user
    };
    Categorie.getCategories((err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.categories = data;
            res.render('admin/categories', opt);
        }
    });

});

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/admin');
});

router.get('/addcategorie', User.checkAuth, (req, res) => {
    let opt = {
        page: 'addcategorie',
        user: req.user
    };
    res.render('admin/addcategorie', opt);
});

router.get('/editcategory/:id', User.checkAuth, (req, res) => {
    let opt = {
        page: 'editcategory',
        user: req.user
    };
    let id = req.params.id ? req.params.id : null;
    Categorie.getCategorieById(id, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.categorie = data;
            res.render('admin/addcategorie', opt);
        }
    });
    
});

router.get('/posts', User.checkAuth, (req, res) => {
    let opt = {
        page: 'posts',
        user: req.user
    };
    let page = req.query.page ? req.query.page : 0;
    Posts.getAll(page, (err, blogposts) => {
        if (err) {
            console.log(err);
        } else {
            opt.posts = blogposts;
            Posts.count((err, count) => {
                if (err) {
                    console.log(err);
                } else {
                    var boostrapPaginator = new pagination.TemplatePaginator({
                        prelink:'/admin/posts/', current: page, rowsPerPage: 7,
                        totalResult: count, slashSeparator: false,
                        template: function(result) {
                            var i, len, prelink;
                            var html = '<div><ul class="pagination">';
                            if(result.pageCount < 2) {
                                html += '</ul></div>';
                                return html;
                            }
                            prelink = this.preparePreLink(result.prelink);
                            if(result.previous) {
                                html += '<li><a href="' + prelink + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
                            }
                            if(result.range.length) {
                                for( i = 0, len = result.range.length; i < len; i++) {
                                    if(result.range[i]-1 === result.current) {
                                        html += '<li class="active"><a href="' + prelink + (result.range[i]-1) + '">' + (result.range[i]) + '</a></li>';
                                    } else {
                                        html += '<li><a href="' + prelink + (result.range[i]-1) + '">' + (result.range[i]) + '</a></li>';
                                    }
                                }
                            }
                            if(result.next) {
                                html += '<li><a href="' + prelink + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
                            }
                            html += '</ul></div>';
                            return html;
                        }
                    });
                    opt.pagination = boostrapPaginator.render();
                    res.render('admin/posts', opt);
                }
            });
        }
    })
    ;
});

router.get('/addpost', User.checkAuth, (req,res)=>{
    let opt = {
        page: 'addpost',
        user: req.user
    };
    Categorie.getCategories((err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.categories = data;
            res.render('admin/addpost',opt);
        }
    });
});

router.get('/editpost/:id',User.checkAuth,(req,res)=>{
    let opt = {
        page: 'editpost',
        user: req.user
    };
    let id = req.params.id ? req.params.id : null;
    Categorie.getCategories((err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.categories = data;
            Posts.getPostById(id,(err,post)=>{
                if(err){
                    console.log(err);
                } else {
                    opt.post = post;
                    res.render('admin/addpost',opt);
                }
            });
        }
    });
});

// post requests
router.post('/login', User.adminLogin);
router.post('/addcategorie', User.checkAuth, Categorie.addCategorie);
router.post('/addpost',User.checkAuth,(req,res)=>{
    Posts.addNew(req,res);
});
router.post('/editpost',User.checkAuth,(req,res)=>{
    Posts.updatePost(req,res);
});

router.post('/editcategorie', User.checkAuth, (req, res) => {
    Categorie.editCategorie(req, res);
});

//delete requests

router.delete('/removecategory', User.checkAuth, (req, res) => {
    Categorie.removeCategory(req, res);
});

router.delete('/removepost',User.checkAuth,(req,res)=>{
    Posts.deletePost(req,res);
});

router.delete('/removepostimg',User.checkAuth,(req,res)=>{
   Posts.deleteMainPic(req.body.id,(err)=>{
      if(err){
          console.log(err);
      } else {
          res.json({success: true});
      }
   });
});

module.exports = router;
