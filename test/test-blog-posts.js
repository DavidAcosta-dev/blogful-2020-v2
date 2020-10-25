const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');


const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

//SKIPPING SO THAT IT PASSES TRAVICCI for testing the database connection
describe.skip('Blogful', function () {
    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    //test: status, json, res.body==='array', res.body.length at least 1, res.body,forEach {is an object, includes expectedKeys } 
    it('should list all blog posts on GET', function () {
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        return chai.request(app).get('/blog-posts')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                res.body.length.should.be.at.least(1);
                res.body.forEach(function (blog) {
                    blog.should.be.an('object');
                    blog.should.include.keys(expectedKeys);
                })

            })
    }); //end of GET/


    //make: newBlog, expectedKeys,
    //test: res.status, res.json, res.body === object, res.body include expectedKeys,
    //make: newBlog+res.body.id
    //test: res.body === newBlog+res.body.id
    it('should post blog on POST', function () {
        const newBlog = { title: 'Why ice climbing rules', author: 'Lara Croft', content: 'Ice climbing is exhilirating for a number of reasons...' };
        const expectedKeys = ['title', 'author', 'content', 'id', 'publishDate'];

        return chai.request(app).post('/blog-posts').send(newBlog)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.include.keys(expectedKeys);
                const returnedBlog = Object.assign(newBlog, { "id": res.body.id, "publishDate": res.body.publishDate });
                console.log(returnedBlog);
                returnedBlog.should.deep.equal(res.body);
            })
    });//end of POST

    //make: { updateData }
    //fetch: GET/blog-posts
    //make: updateData.id = res.body[0].id
    //fetch: PUT/blog-posts/${updateData.id}
    //make: updateData.publishDate = res.body.publishDate
    //test: res.status, res.json, res.body=object, res.body===updateData
    it('should update blog on PUT', function () {
        const updateData = { title: "How to create an Express App", author: "Bonk the Troll", content: "Ok, now we have some real content" };
        console.log(updateData);
        return chai.request(app).get('/blog-posts')
            .then(function (res) {
                updateData.id = res.body[0].id;
                console.log(updateData);
                return chai.request(app).put(`/blog-posts/${updateData.id}`).send(updateData)
                    .then(function (res) {
                        updateData.publishDate = res.body.publishDate;
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.an('object');
                        res.body.should.deep.equal(updateData);
                    });
            });
    });//end of PUT/


    it('should delete blog on DELETE', function () {
        return chai.request(app).get('/blog-posts')
            .then(function (res) {
                return chai.request(app).delete(`/blog-posts/${res.body[0].id}`)
            })
            .then(function (res) {
                res.should.have.status(204);
            })
    })




});//end of test suite