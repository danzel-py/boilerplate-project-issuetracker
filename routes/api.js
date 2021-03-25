'use strict';

const ObjectID = require('mongodb').ObjectID;

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
      let project_name = 'apitest'
      /* collection.findOne({project_name: project_name},(err, project)=>{
        if (err) return console.log(err)
        if (!project){
          collection.insertOne({project_name: project_name, issues: []})
        }
        let newIssue = {
          _id: new ObjectID(),
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          ... (req.body.assigned_to && {assigned_to: req.body.assigned_to}),
          ... (req.body.status_text && {status_text: req.body.status_text})
        }
        
      }) */
      let newIssue = {
        _id: new ObjectID(),
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        ... (req.body.assigned_to && {assigned_to: req.body.assigned_to}),
        ... (req.body.status_text && {status_text: req.body.status_text})
      }
      collection.updateOne({project_name: project_name},
        {$push: {issues: newIssue}})
    })
    /*
    _id
      issue_title
      issue_text
      created_by
      assigned_to
      status_text
      */
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
