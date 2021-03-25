'use strict';


module.exports = function (app,collection) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project_name = req.params.project;
      collection.findOne({project_name: project_name},(err,project)=>{
        if (err) return console.log(err)
        if (!project) res.send([])
        res.send(project.issues)
      })
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
