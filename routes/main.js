const express = require('express');
const router = express.Router();
const categorie = require('../controllers/categorieController');
const Movies = require('../controllers/movieController');

const Categorie = new categorie();

router.get('/',(req,res)=>{
	let opt = {
		page: 'home'
	}
	Categorie.getCategories((err,categories)=>{
		opt.categories = categories;
		Movies.getMovies((err,movies)=>{
			opt.movies = movies;
			res.render('front/homepage',opt);
		});
	});
	
});

module.exports=router;