const categorie = require('../models/categories');

class Categorie {
  addCategorie(req,res){
    if(req.isAuthenticated()){
      req.checkBody('title','title is required').notEmpty();
      req.getValidationResult().then(result =>{
        if(!result.isEmpty()){
          res.json(result.array());
        }else{
          categorie.addNewCategorie(req.body,(err,data)=>{
            if(err) {
              console.log(err);
            }else{
              res.redirect('/admin/addcategorie');
            }
          });
        }
      })
    }
  }

  getCategories(cb){
    categorie.getCategories(cb);
  }

  removeCategory(req,res){
    req.checkBody('id','id is required').notEmpty();
    req.getValidationResult().then(result =>{
        if(!result.isEmpty()){
          res.json(result.array());
        }else{
          categorie.removeCategorie(req.body.id,(err,cat)=>{
            if(err){
              console.log(err);
            }else{
              res.json({success: true});
            }
          });
        }
      })
  }

  getCategorieById(id,cb){
    categorie.getCategoryById(id,cb);
  }

  search(req,res){
    let patt = req.query.search;
    if(patt){
      categorie.search(patt,(err,categories)=>{
        if(err){
          console.log(err);
        } else {
          res.json(categories);
        }
      });
    }
  }

  editCategorie(req,res){
    req.checkBody('title','title is required').notEmpty();
    req.checkBody('id','id is required').notEmpty();
    req.getValidationResult().then(result =>{
      if(!result.isEmpty()){
        res.json(result.array());
      }else{
        categorie.updateCategorie(req.body,(err,data)=>{
          if(err){
            console.log(err);
          }else{
            res.redirect(`/admin/editcategory/${data._id}`);
          }
        });
      }
    })
  }
}

module.exports = new Categorie();
