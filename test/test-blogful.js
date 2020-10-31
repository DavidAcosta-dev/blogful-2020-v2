'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const expect = chai.expect;
const should = chai.should();

const { BlogPost } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

//-----------------------setting up our Test TOOL FUNCTIONS---------------------------------------

//declaring a funcion that we'll use later to delete the database.
//we'll call it in afterEach() hook to ensure data from one test
//doesn't stick for the next
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('DELETING DATABASE, ZEROING OUT!');
        mongoose.connection.dropDatabase()
            .then(zeroedDb => resolve(zeroedDb))
            .catch(err => reject(err));
    });
};

//We are obviously not able to test the authors database so I can't really test how the two collections work together, so
//for now we are just intering the older version of the author: property on the blog.
function seedBlogData() {
    console.info('SEEDING blog post data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            author: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            title: faker.lorem.sentence(),
            content: faker.lorem.text()
        })
    }
    return BlogPost.insertMany(seedData);
};



//--------------------------TESTS BEGIN-----------------------------------------

describe('Should add up', function() {
    it('2+2 = 4', function(){
        (2+2).should.equal(4);
    });
});

/*
describe.skip('blog-posts api CRUD test suite', function () {
    // before(function () {
    //     return runServer(TEST_DATABASE_URL);
    // });

    // beforeEach(function () {
    //     return seedBlogData();
    // })

    // afterEach(function () {
    //     // tear down database so we ensure no state from this test
    //     // effects any coming after.
    //     return tearDownDb();
    // });

    // after(function () {
    //     return closeServer();
    // });




    describe.skip('GET/blog-posts', function () {

        it('should return all existing posts', function () {
            //strategy:
            //  1. get back all posts returned by GET request to '/'
            //  2. prove res has right status, data type
            //  3. prove the number of posts we got back is equal to number in db.
            let res;
            return chai.request(app)
                .get('/blog-posts')
                .then(_res => {
                    res = _res;//loading our empty res variable with resulting _res response object from our GET call
                    console.log("HERE YOU GO!!!!!!!! ", res.body);
                    res.should.have.status(200);
                    //otherwise our db seeding didn't work
                    res.body.should.have.lengthOf.at.least(1);

                    return BlogPost.count();
                })

        });//end of it(1A)//end of GET

    })//end of describe('GET/blog-posts'

});//end of test suite
*/
















    // =========================OLD TESTS BELOW

    //test: status, json, res.body==='array', res.body.length at least 1, res.body,forEach {is an object, includes expectedKeys } 
    /*  it('should list all blog posts on GET', function () {
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
    */



