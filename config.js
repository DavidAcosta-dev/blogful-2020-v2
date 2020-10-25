'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/local-blogposts-2020";

exports.TEST_DATABASE_URL = process.env || "mongodb://localhost/test-local-blogposts-2020";

exports.PORT = process.env.PORT || 8080;

//NOTE: the local databases DO NOT EXIST