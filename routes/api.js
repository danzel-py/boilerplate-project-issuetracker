'use strict';

const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, collection) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project_name = req.params.project;
      collection.findOne({ project_name: project_name }, (err, project) => {
        if (err) return console.log(err)
        if (!project) res.send([])
        let filteredArray = project.issues

        if(req.query.issue_title){
          filteredArray = filteredArray.filter(issues => issues.issue_title === req.query.issue_title)
        }
        if(req.query.issue_text){
          filteredArray = filteredArray.filter(issues => issues.issue_text === req.query.issue_text)
        }
        if(req.query.assigned_to){
          filteredArray = filteredArray.filter(issues => issues.assigned_to === req.query.assigned_to)
        }
        if(req.query.created_by){
          filteredArray = filteredArray.filter(issues => issues.created_by === req.query.created_by)
        }
        if(req.query.status_text){
          filteredArray = filteredArray.filter(issues => issues.status_text === req.query.status_text)
        }
        let openStatus = req.query.open === 'true' ? true : false
        if(req.query.open){
          filteredArray = filteredArray.filter(issues => issues.open == openStatus)
        }

        res.send(filteredArray)
      })
    })

    .post(function (req, res) {
      let project_name = 'apitest'
      if(req.body.issue_title || req.body.issue_text|| req.body.created_by){
        let newIssue = {
          _id: new ObjectID(),
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          ... (req.body.assigned_to && { assigned_to: req.body.assigned_to }),
          ... (req.body.status_text && { status_text: req.body.status_text }),
          open: true,
          created_on: new Date(),
          updated_on: new Date()
        }
        collection.updateOne({ project_name: project_name },
          { $push: { issues: newIssue } })
      }

      // Required FIELDS aren't filled
      else{
        res.send({ error: 'required field(s) missing' })
      }
    })
    
    .put(function (req, res) {
      let project_name = 'apitest';
      if(!req.body._id){
        res.send({ error: 'missing _id' })
      }

      collection.findOne({ project_name: project_name }, (err, project) => {
        if (err) return console.log(err)
        let selectedIssues = project.issues

        // WHEN ID IS VALID
        if (selectedIssues.find(x => x._id == req.body._id)) {

          // OPTIONAL UPDATE
          if (req.body.issue_title) {
            collection.updateOne({ project_name: project_name }, {
              $set: {
                "issues.$[issue].issue_title": req.body.issue_title
              }
            }, {
              arrayFilters: [{ "issue._id": ObjectID(req.body._id) }]
            })
          }
          if (req.body.issue_text) {
            collection.updateOne({ project_name: project_name }, {
              $set: {
                "issues.$[issue].issue_text": req.body.issue_text
              }
            }, {
              arrayFilters: [{ "issue._id": ObjectID(req.body._id) }]
            })
          }
          if (req.body.created_by) {
            collection.updateOne({ project_name: project_name }, {
              $set: {
                "issues.$[issue].created_by": req.body.created_by
              }
            }, {
              arrayFilters: [{ "issue._id": ObjectID(req.body._id) }]
            })
          }
          if (req.body.assigned_to) {
            collection.updateOne({ project_name: project_name }, {
              $set: {
                "issues.$[issue].assigned_to": req.body.assigned_to
              }
            }, {
              arrayFilters: [{ "issue._id": ObjectID(req.body._id) }]
            })
          }
          if (req.body.status_text) {
            collection.updateOne({ project_name: project_name }, {
              $set: {
                "issues.$[issue].status_text": req.body.status_text
              }
            }, {
              arrayFilters: [{ "issue._id": ObjectID(req.body._id) }]
            })
          }
          if (req.body.open) {
            collection.updateOne({ project_name: project_name }, {
              $set: {
                "issues.$[issue].open": false
              }
            }, {
              arrayFilters: [{ "issue._id": ObjectID(req.body._id) }]
            })
          }

          // IF ANYTHING GETS UPDATED
          if (req.body.issue_title || req.body.issue_text || req.body.created_by || req.body.assigned_to || req.body.status_text || req.body.open) {
            collection.updateOne({ project_name: project_name }, {
              $set: {
                "issues.$[issue].updated_on": new Date()
              }
            }, {
              arrayFilters: [{ "issue._id": ObjectID(req.body._id) }]
            })
            res.send({
              result: 'successfully updated',
              _id: req.body._id
            })
          }

          // IF NOTHING GETS UPDATED
          else{
            res.send({ error: 'no update field(s) sent', '_id': req.body._id })
          }
        }

        // WHEN ID IS INVALID
        else {
          res.send({ error: 'could not update', '_id': req.body._id })
        }
      })
    })

    .delete(function (req, res) {
      if(!req.body._id){
        res.send({ error: 'missing _id' })
      }
      let project_name = 'apitest';

      collection.findOne({ project_name: project_name }, (err, project) => {
        if (err) return console.log(err)
        let selectedIssues = project.issues

        // WHEN ID IS VALID
        if (selectedIssues.find(x => x._id == req.body._id)) {
          collection.updateOne({ project_name: project_name },
            { $pull: { issues:{ _id: ObjectID(req.body._id)}} })
          res.send({ result: 'successfully deleted', '_id': req.body_id })
        }

        //WHEN ID IS INVALID
        else{
          res.send({ error: 'could not delete', '_id': req.body_id })
        }

      })


    });

};
