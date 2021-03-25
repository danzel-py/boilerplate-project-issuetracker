'use strict';

const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, collection) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project_name = req.params.project;
      collection.findOne({ project_name: project_name }, (err, project) => {
        if (err) return console.log(err)
        if (!project) res.send([])
        res.send(project.issues)
      })
    })

    .post(function (req, res) {
      let project_name = 'apitest'
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
    })
    
    .put(function (req, res) {
      let project_name = 'apitest';

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
        }

        // WHEN ID IS INVALID
        else {
          res.send('invalid id')
        }
      })
    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
