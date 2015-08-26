var app = require('../../command/server').app;
var request = require('supertest').agent(app.listen());

describe("Creating exercises", function() {
  describe("with good data", function() {
    it("should return 202", function(done) {
      request
        .post('/exercises')
        .send({"name": "Pullup"})
        .expect(202, done);
    });
  });
  describe("with bad data", function() {
    it("should return 400 with bad body", function(done) {
      request
        .post('/exercises')
        .send({})
        .expect(400, done);
    });
    it("should return 400 with no body", function(done) {
      request
        .post('/exercises')
        .expect(400, done);
    });
    it("should return 400 with garbage body", function(done) {
      request
        .post('/exercises')
        .send("hi mom")
        .expect(400, done);
    });
  });
});

describe("Creating workouts", function() {
  describe("with good data", function() {
    it("should return 202", function(done) {
      request
        .post('/workouts')
        .send({name: "Group B"})
        .expect('Location', /^\/workout\/([\w-])+/)
        .expect(202, done);
    });
  });
  describe("with bad data", function() {
    it("should return 400 with bad body", function(done) {
      request
        .post('/workouts')
        .send({})
        .expect(400, done);
    });
    it("should return 400 with no body", function(done) {
      request
        .post('/workouts')
        .expect(400, done);
    });
    it("should return 400 with garbage data", function(done) {
      request
        .post('/workouts')
        .send("hi mom")
        .expect(400, done);
    });
  });
});

describe("Adding expected", function() {
  describe("with good data", function() {
    it("should return 202", function(done) {
      request
        .post('/workout/1234-13-12314')
        .send({exercise: {name: "Pullups"}, count: 4})
        .expect(202, done);
    });
  });
  describe("with bad data", function() {
    it("should return 400 with no exercise", function(done) {
      request
        .post('/workout/1234-13-12314')
        .send({count: 4})
        .expect(400, done);
    });
    it("should return 400 with no count", function(done) {
      request
        .post('/workout/1234-13-12314')
        .send({exercise: {name: "Pullups"}})
        .expect(400, done);
    });
    it("should return 400 with no body", function(done) {
      request
        .post('/workout/1234-13-12314')
        .expect(400, done);
    });
    it("should return 400 with garbage data", function(done) {
      request
        .post('/workout/1234-13-12314')
        .send("hi mom")
        .expect(400, done);
    });
    it("should return 404 for missing id", function(done) {
      request
        .post('/workout')
        .send({exercise: {name: "Pullups"}, count: 4})
        .expect(404, done);
    });
  });
});
