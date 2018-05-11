const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminUserController');
const categorie = require('../controllers/categorieController');
const directos = require('../controllers/directorsController');
const actors = require('../controllers/actorController');
const Movies = require('../controllers/movieController');

const adminUser = new admin();
const Categorie = new categorie();
const Directors = new directos();
const Actors = new actors();

// get requests
router.get('/', (req, res) => {
    let opt = {
        page: 'login'
    };
    res.render('admin/login', opt);
});

router.get('/dashboard', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'dashboard',
        user: req.user
    };
    res.render('admin/dashboard', opt);
});

router.get('/categories', adminUser.checkAuth, (req, res) => {
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

router.get('/addcategorie', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'addcategorie',
        user: req.user
    };
    res.render('admin/addcategorie', opt);
});

router.get('/editcategory/:id', adminUser.checkAuth, (req, res) => {
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

router.get('/movies', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'movies',
        user: req.user
    };
    Movies.getMovies((err, movies) => {
        if (err) {
            console.log(err);
        } else {
            opt.movies = movies;
            res.render('admin/movies', opt);
        }
    });

});

router.get('/addmovie', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'addmovie',
        user: req.user
    };
    Categorie.getCategories((err, categories) => {
        opt.categories = categories;
        Directors.getDirectors((err, directors) => {
            opt.directors = directors;
            Actors.getActors((err, actors) => {
                opt.actors = actors;
                res.render('admin/addmovie', opt);
            });
        });
    });
});

router.get('/directors', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'directors',
        user: req.user
    };
    Directors.getDirectors((err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.directors = data;
            res.render('admin/directors', opt);
        }
    });
});

router.get('/adddirector', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'adddirector',
        user: req.user
    };
    res.render('admin/adddirector', opt);
});

router.get('/editdirector/:id', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'editdirector',
        user: req.user
    };
    let id = req.params.id ? req.params.id : null;
    Directors.getDirectorById(id, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.director = data;
            res.render('admin/adddirector', opt);
        }
    });

})

router.get('/actors', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'actors',
        user: req.user
    };
    Actors.getActors((err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.actors = data;
            res.render('admin/actors', opt);
        }
    });

});

router.get('/editactor/:id', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'editactor',
        user: req.user
    };
    let id = req.params.id ? req.params.id : null;
    Actors.getActorById(id, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            opt.actor = data;
            res.render('admin/addactor', opt);
        }
    });
});

router.get('/addactor', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'addactor',
        user: req.user
    };
    res.render('admin/addactor', opt);
});

router.get('/editmovie/:id', adminUser.checkAuth, (req, res) => {
    let opt = {
        page: 'editmovie',
        user: req.user
    };
    let id = req.params.id ? req.params.id : null;
    Categorie.getCategories((err, categories) => {
        opt.categories = categories;
        Directors.getDirectors((err, directors) => {
            opt.directors = directors;
            Actors.getActors((err, actors) => {
                opt.actors = actors;
                Movies.getMovieById(id, (err, movie) => {
                    if (err) {
                        console.log(err);
                    } else {
                        opt.movie = movie;
                        res.render('admin/addmovie', opt);
                    }
                });
            });
        });
    });
});

router.get('/logout', adminUser.logOut);

// post requests
router.post('/login', adminUser.login);
router.post('/addcategorie', adminUser.checkAuth, Categorie.addCategorie);

router.post('/adddirector', adminUser.checkAuth, (req, res, next) => {
    Directors.addDirector(req, res, next);
});

router.post('/addactor', adminUser.checkAuth, (req, res, next) => {
    Actors.AddActor(req, res, next);
});

router.post('/addmovie', adminUser.checkAuth, (req, res) => {
    Movies.addMovie(req, res);
})

router.post('/editdirector', adminUser.checkAuth, (req, res) => {
    Directors.editDirector(req, res);
});

router.post('/editactor', adminUser.checkAuth, (req, res, next) => {
    Actors.editActor(req, res);
})

router.post('/editcategorie', adminUser.checkAuth, (req, res) => {
    Categorie.editCategorie(req, res);
})

router.post('/editmovie',adminUser.checkAuth,(req,res)=>{
  Movies.editMovie(req,res);
});

//put requests
router.put('/removediravatar', adminUser.checkAuth, (req, res) => {
    Directors.deleteAvatar(req.body, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true, id: req.body.id });
        }
    });
});

router.put('/removeactavatar', adminUser.checkAuth, (req, res) => {
    Actors.deleteAvatar(req.body, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true, id: req.body.id });
        }
    });
});

router.put('/removemovieposter',adminUser.checkAuth, (req,res)=>{
    Movies.deletePoster(req.body.id,(err)=>{
        if(err){
            console.log(err);
        } else {
            res.json({success: true});
        }
    });
});

router.put('/removemoviesubtitle', adminUser.checkAuth, (req,res)=>{
    Movies.deleteSubtitle(req.body,(err)=>{
        if(err){
            console.log(err);
        } else {
            res.json({success: true});
        }
    });
});



//delete requests
router.delete('/deldirector', adminUser.checkAuth, (req, res) => {
    Directors.deleteDirector(req.body, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true });
        }
    });
});

router.delete('/delactor', adminUser.checkAuth, (req, res) => {
    Actors.deleteActor(req.body, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true, id: req.body.id });
        }
    });
});

router.delete('/removecategory', adminUser.checkAuth, (req, res) => {
    Categorie.removeCategory(req, res);
});

router.delete('/deletemovie', adminUser.checkAuth, (req, res) => {
    Movies.deleteMovie(req, res);
})


module.exports = router;
