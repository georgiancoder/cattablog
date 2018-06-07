const express = require('express');
const router = express.Router();
const Categorie = require('../controllers/categorieController');
const Posts = require('../controllers/postsController');
const MailController = require('../controllers/mailController');
const pagination = require('pagination');

router.get('/', (req, res) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let opt = {
        page: 'home',
        url: fullUrl,
        originUrl: req.protocol + '://' + req.get('host')
    };
    let page = req.query.page ? req.query.page : 0;
    Categorie.getCategories((err, categories) => {
        if (err) {
            console.log(err);
        } else {
            opt.categories = categories;
            Posts.randomPosts((err, rposts) => {
                if (err) {
                    console.log(err);
                } else {
                    opt.rposts = rposts;
                    Posts.getAllPost(page, (err, posts) => {
                        if (err) {
                            console.log(err);
                        } else {
                            Posts.count((err, count) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var boostrapPaginator = new pagination.TemplatePaginator({
                                        prelink: '/', current: page, rowsPerPage: 7,
                                        totalResult: count, slashSeparator: false,
                                        template: function (result) {
                                            var i, len, prelink;
                                            var html = '<ul class="pagination">';
                                            if (result.pageCount < 2) {
                                                html += '</ul></div>';
                                                return html;
                                            }
                                            prelink = this.preparePreLink(result.prelink);
                                            if (result.previous) {
                                                html += '<li><a href="' + prelink + result.previous + '"><img src="./assets/imgs/left-arrows.png" alt="Предыдущая страница" title="Предыдущая страница"></a></li>';
                                            }
                                            if (result.range.length) {
                                                for (i = 0, len = result.range.length; i < len; i++) {
                                                    if (result.range[i] - 1 === result.current) {
                                                        html += '<li><a href="' + prelink + (result.range[i] - 1) + '" class="active">' + (result.range[i]) + '</a></li>';
                                                    } else {
                                                        html += '<li><a href="' + prelink + (result.range[i] - 1) + '">' + (result.range[i]) + '</a></li>';
                                                    }
                                                }
                                            }
                                            if (result.next) {
                                                html += '<li><a href="' + prelink + result.next + '" class="paginator-next"><img src="./assets/imgs/right-arrows.png" alt="следущая страница" title="следущая страница"></a></li>';
                                            }
                                            html += '</ul>';
                                            return html;
                                        }
                                    });
                                    opt.posts = posts;
                                    opt.pagination = boostrapPaginator.render();
                                    Posts.getPopular((err, popular) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            opt.popular = popular;
                                            res.render('./blog/index', opt);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/post/:slug/:id', (req, res) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let opt = {
        page: 'innerpost',
        url: fullUrl,
        originUrl: req.protocol + '://' + req.get('host')
    };
    if (req.params.slug && req.params.id) {
        let id = req.params.id;
        Posts.increaseView(id, (err, view) => {
            if (err) {
                console.log(err);
            }
        });
        Categorie.getCategories((err, categories) => {
            if (err) {
                console.log(err);
            } else {
                opt.categories = categories;
                Posts.getPostData(id, (err, postData) => {
                    if (err) {
                        console.log(err);
                    } else {
                        opt.post = postData;
                        Posts.getPopular((err, popular) => {
                            if (err) {
                                console.log(err);
                            } else {
                                opt.popular = popular;
                                res.render('./blog/singlepost', opt);
                            }
                        });

                    }
                });
            }
        });
    }
});


router.get('/contact', (req, res) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let opt = {
        page: 'contact',
        url: fullUrl,
        originUrl: req.protocol + '://' + req.get('host')
    };
    Categorie.getCategories((err, categories) => {
        if (err) {
            console.log(err);
        } else {
            opt.categories = categories;
            Posts.getPopular((err, popular) => {
                if (err) {
                    console.log(err);
                } else {
                    opt.popular = popular;
                    res.render('./blog/contact', opt);
                }
            });

        }
    });
});

router.get('/category/:id', (req, res) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let opt = {
        page: 'category',
        url: fullUrl,
        originUrl: req.protocol + '://' + req.get('host')
    };
    if (req.params.id) {
        let id = req.params.id;
        let page = req.query.page ? req.query.page : 0;
        Categorie.getCategories((err, categories) => {
            if (err) {
                console.log(err);
            } else {
                opt.categories = categories;
                Posts.randomPosts((err, rposts) => {
                    if (err) {
                        console.log(err);
                    } else {
                        opt.rposts = rposts;
                        Posts.getPostByCategorie(page, id, (err, posts) => {
                            if (err) {
                                console.log(err);
                            } else {
                                var boostrapPaginator = new pagination.TemplatePaginator({
                                    prelink: '/category/' + id + '/', current: page, rowsPerPage: 7,
                                    totalResult: (posts.length) ? posts[0].postCount : 0, slashSeparator: false,
                                    template: function (result) {
                                        var i, len, prelink;
                                        var html = '<ul class="pagination">';
                                        if (result.pageCount < 2) {
                                            html += '</ul></div>';
                                            return html;
                                        }
                                        prelink = this.preparePreLink(result.prelink);
                                        if (result.previous) {
                                            html += '<li><a href="' + prelink + result.previous + '"><img src="/assets/imgs/left-arrows.png" alt="Предыдущая страница" title="Предыдущая страница"></a></li>';
                                        }
                                        if (result.range.length) {
                                            for (i = 0, len = result.range.length; i < len; i++) {
                                                if (result.range[i] - 1 === result.current) {
                                                    html += '<li><a href="' + prelink + (result.range[i] - 1) + '" class="active">' + (result.range[i]) + '</a></li>';
                                                } else {
                                                    html += '<li><a href="' + prelink + (result.range[i] - 1) + '">' + (result.range[i]) + '</a></li>';
                                                }
                                            }
                                        }
                                        if (result.next) {
                                            html += '<li><a href="' + prelink + result.next + '" class="paginator-next"><img src="/assets/imgs/right-arrows.png" alt="следущая страница" title="следущая страница"></a></li>';
                                        }
                                        html += '</ul>';
                                        return html;
                                    }
                                });
                                opt.posts = posts;
                                opt.pagination = boostrapPaginator.render();

                                Posts.getPopular((err, popular) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        opt.popular = popular;
                                        res.render('./blog/category', opt);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

router.get('/search', (req, res) => {
    let srchPattern = req.query.srch;
    let page = req.query.page ? req.query.page : 0;
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let opt = {
        page: 'search',
        url: fullUrl,
        originUrl: req.protocol + '://' + req.get('host')
    };
    Categorie.getCategories((err, categories) => {
        if (err) {
            console.log(err);
        } else {
            opt.categories = categories;
            Posts.search(page, srchPattern, (err, searchData) => {
                if (err) {
                    console.log(err);
                } else {
                    opt.searchData = searchData;
                    var boostrapPaginator = new pagination.TemplatePaginator({
                        prelink: '/search/?srch=' + srchPattern, current: page, rowsPerPage: 7,
                        totalResult: (searchData.length) ? searchData[0].postCount : 0, slashSeparator: false,
                        template: function (result) {
                            var i, len, prelink;
                            var html = '<ul class="pagination">';
                            if (result.pageCount < 2) {
                                html += '</ul></div>';
                                return html;
                            }
                            prelink = this.preparePreLink(result.prelink);
                            if (result.previous) {
                                html += '<li><a href="' + prelink + result.previous + '"><img src="/assets/imgs/left-arrows.png" alt="Предыдущая страница" title="Предыдущая страница"></a></li>';
                            }
                            if (result.range.length) {
                                for (i = 0, len = result.range.length; i < len; i++) {
                                    if (result.range[i] - 1 === result.current) {
                                        html += '<li><a href="' + prelink + (result.range[i] - 1) + '" class="active">' + (result.range[i]) + '</a></li>';
                                    } else {
                                        html += '<li><a href="' + prelink + (result.range[i] - 1) + '">' + (result.range[i]) + '</a></li>';
                                    }
                                }
                            }
                            if (result.next) {
                                html += '<li><a href="' + prelink + result.next + '" class="paginator-next"><img src="/assets/imgs/right-arrows.png" alt="следущая страница" title="следущая страница"></a></li>';
                            }
                            html += '</ul>';
                            return html;
                        }
                    });
                    opt.pagination = boostrapPaginator.render();

                    Posts.getPopular((err, popular) => {
                        if (err) {
                            console.log(err);
                        } else {
                            opt.popular = popular;
                            res.render('./blog/search', opt);
                        }
                    });
                }
            });

        }
    });
});

router.post('/email', (req, res) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let opt = {
        page: 'email',
        url: fullUrl,
        originUrl: req.protocol + '://' + req.get('host')
    };
    req.checkBody('name', 'Укажите имя').notEmpty();
    req.checkBody('email', 'Введите адрес электронной почты').notEmpty();
    req.checkBody('email', 'эл почта неправильная').isEmail()
    req.checkBody('msg', 'Укажите сообщение').notEmpty();
    req.getValidationResult().then(function (results) {
        if (!results.isEmpty()) {
            opt.errors = results.array()
            Categorie.getCategories((err, categories) => {
                if (err) {
                    console.log(err);
                } else {
                    opt.categories = categories;

                    Posts.getPopular((err, popular) => {
                        if (err) {
                            console.log(err);
                        } else {
                            opt.popular = popular;
                            res.render('./blog/contact', opt);
                        }
                    });
                }
            });
        } else {
            MailController.mailer({
                email: req.body.email,
                subject: 'contact',
                text: req.body.msg,
                name: req.body.name,
                html: req.body.msg
            }, (info) => {
                res.redirect('/contact');
            });

        }
    });
});

module.exports = router;
