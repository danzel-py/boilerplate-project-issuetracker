const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectID } = require('bson');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    test('Create an issue with every field: POST request to /api/issues/{project}',()=>{
        chai.request(server)
        .post('/api/issues/apitest')
        .send({
            issue_title: 'title test',
            issue_text: 'text test',
            created_by: 'by test',
            assigned_to: 'to test',
            status_text: 'status test',
        })
        .end((err,res)=>{
            assert.equal(err,null)
            assert.property(res.body, "_id")
            assert.property(res.body, "open")
            assert.property(res.body, "created_on")
            assert.property(res.body, "updated_on")
            assert.equal(res.body.issue_title, 'title test')
            assert.equal(res.body.issue_text, 'text test')
            assert.equal(res.body.created_by, 'by test')
            assert.equal(res.body.assigned_to, 'to test')
            assert.equal(res.body.status_text, 'status test')
        })
    })
    
    test('Create an issue with only required fields: POST request to /api/issues/{project}',()=>{
        chai.request(server)
        .post('/api/issues/apitest')
        .send({
            issue_title: 'title test2',
            issue_text: 'text test2',
            created_by: 'by test2',
        })
        .end((err,res)=>{
            assert.equal(err,null)
            assert.property(res.body, "_id")
            assert.property(res.body, "open")
            assert.property(res.body, "created_on")
            assert.property(res.body, "updated_on")
            assert.equal(res.body.issue_title, 'title test2')
            assert.equal(res.body.issue_text, 'text test2')
            assert.equal(res.body.created_by, 'by test2')
        })
    })
    
    test('Create an issue with missing required fields: POST request to /api/issues/{project}',()=>{
        chai.request(server)
        .post('/api/issues/apitest')
        .send({
            issue_title: 'title test2',
            issue_text: 'text test2',
        })
        .end((err,res)=>{
            assert.equal(err,null)
            assert.deepEqual(res.body,{ error: 'required field(s) missing' })
        })
    })
    
    
    test('View issues on a project: GET request to /api/issues/{project}',()=>{
        chai.request(server)
        .get('/api/issues/apitest')
        .end((err,res)=>{
            assert.equal(err, null)
            assert.isArray(res.body)
            assert.include(res.body.map(e=>e.created_by),'by test2')
            assert.include(res.body.map(e=>e.issue_text),'text test2')
            assert.include(res.body.map(e=>e.issue_title),'title test2')
            assert.include(res.body.map(e=>e.assigned_to),'to test')
            assert.include(res.body.map(e=>e.status_text),'status test')
        })
    })
    test('View issues on a project with one filter: GET request to /api/issues/{project}',()=>{
        chai.request(server)
        .get('/api/issues/apitest?open=false')
        .end((err,res)=>{
            assert.equal(err, null)
            assert.isArray(res.body)
            assert.notInclude(res.body.map(e=>e.open), true)
        })
    })
    
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}',()=>{
        chai.request(server)
        .get('/api/issues/apitest?open=true&created_by=by test')
        .end((err,res)=>{
            assert.equal(err, null)
            assert.isArray(res.body)
            assert.notInclude(res.body.map(e=>e.open), false)
            res.body.forEach(element => {
                assert.equal(element.created_by, 'by test')
            });
            
        })
    })

    test('Update one field on an issue: PUT request to /api/issues/{project}',()=>{
        let randomnum = Math.random().toString()
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: ObjectID('605c4ef52b1e2e0df1eaef48'),
                created_by: randomnum
            })
            .end((err,res)=>{
                assert.equal(err, null)
                assert.deepEqual(res.body, {"result":"successfully updated","_id":"605c4ef52b1e2e0df1eaef48"})
            })
    })
    
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}',()=>{
        let randomnum = Math.random().toString()
        let randomnum2 = Math.random().toString()
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: ObjectID('605d66709110da10a02630d3'),
                created_by: randomnum,
                assigned_to: randomnum2
            })
            .end((err,res)=>{
                assert.equal(err, null)
                assert.deepEqual(res.body, {"result":"successfully updated","_id":"605d66709110da10a02630d3"})
            })
    })

    test('Update an issue with missing _id: PUT request to /api/issues/{project}',()=>{
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                created_by: 'me'
            })
            .end((err,res)=>{
                assert.equal(err, null)
                assert.deepEqual(res.body, { error: 'missing _id' })
            })
    })
    
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}',()=>{
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: ObjectID('605d66709110da10a02630d3')
            })
            .end((err,res)=>{
                assert.equal(err, null)
                assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': '605d66709110da10a02630d3' })
            })
    })
    
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}',()=>{
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: ObjectID('aaad6670aaa0da10a02630d3')
            })
            .end((err,res)=>{
                assert.equal(err, null)
                assert.deepEqual(res.body,{ error: 'could not update', '_id': 'aaad6670aaa0da10a02630d3'})
            })
    })
    
    test('Delete an issue: DELETE request to /api/issues/{project}',()=>{
        chai.request(server)
            .get('/api/issues/apitest')
            .end((err,res)=>{
                assert.equal(err, null)
                chai.request(server)
                    .delete('/api/issues/apitest')
                    .send({
                        _id: res.body[20]._id
                    })
                    .end((err,res)=>{
                        assert.deepEqual(res.body,{ result: 'successfully deleted'})
                    })

            })
    })

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}',()=>{
        chai.request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: 'invalidid'
            })
            .end((err,res)=>{
                assert.equal(err, null)
                assert.deepEqual(res.body, { error: 'could not delete'})
            })
    })

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}',()=>{
        chai.request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: null,
                dummy: 'dummy'
            })
            .end((err,res)=>{
                assert.equal(err, null)
                assert.deepEqual(res.body, {error: "missing _id"})
            })
    })
});
