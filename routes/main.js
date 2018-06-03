const express = require('express');
const router = express.Router();
const Categorie = require('../controllers/categorieController');
const Posts = require('../controllers/postsController');
const pagination = require('pagination');

router.get('/',(req,res)=>{
	let opt = {
		page: 'home'
	};
    let page = req.query.page ? req.query.page : 0;
	Categorie.getCategories((err,categories)=>{
		if(err){
			console.log(err);
		} else {
			opt.categories = categories;
			Posts.randomPosts((err, rposts)=>{
				if(err){
					console.log(err);
				} else {
                    opt.rposts = rposts;
                    Posts.getAll(page,(err, posts)=>{
						if(err){
							console.log(err);
						} else {
                            Posts.count((err, count) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var boostrapPaginator = new pagination.TemplatePaginator({
                                        prelink:'/', current: page, rowsPerPage: 7,
                                        totalResult: count, slashSeparator: false,
                                        template: function(result) {
                                            var i, len, prelink;
                                            var html = '<ul class="pagination">';
                                            if(result.pageCount < 2) {
                                                html += '</ul></div>';
                                                return html;
                                            }
                                            prelink = this.preparePreLink(result.prelink);
                                            if(result.previous) {
                                                html += '<li><a href="' + prelink + result.previous + '"><img src="./assets/imgs/left-arrows.png" alt="Предыдущая страница" title="Предыдущая страница"></a></li>';
                                            }
                                            if(result.range.length) {
                                                for( i = 0, len = result.range.length; i < len; i++) {
                                                    if(result.range[i]-1 === result.current) {
                                                        html += '<li><a href="' + prelink + (result.range[i]-1) + '" class="active">' + (result.range[i]) + '</a></li>';
                                                    } else {
                                                        html += '<li><a href="' + prelink + (result.range[i]-1) + '">' + (result.range[i]) + '</a></li>';
                                                    }
                                                }
                                            }
                                            if(result.next) {
                                                html += '<li><a href="' + prelink + result.next + '" class="paginator-next"><img src="./assets/imgs/right-arrows.png" alt="следущая страница" title="следущая страница"></a></li>';
                                            }
                                            html += '</ul>';
                                            return html;
                                        }
                                    });
                                    opt.posts = posts;
                                    opt.pagination = boostrapPaginator.render();
                                    res.render('./blog/index',opt);
                                }
                            });
						}
					});
				}
			});
		}
	});
});




module.exports=router;
