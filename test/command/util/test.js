var Replayer = require('../../../command/utils/replay'),
    sinon = require('sinon'),
    should = require('should')
    ;

var replayer,
    db;
describe("Replayer", function() {
    describe("creation", function(){
        it("should use the viewName and constructor given", function() {
            var modelReplay = sinon.stub();
            var view = sinon.stub();
            var db = { view: view };

            Replayer(db, "testview", modelReplay)("id")

            modelReplay.calledWithNew().should.be.ok;
            view.calledWith("testview", "event_log", {"key": "id"}).should.be.ok;
        });
    })

    describe("replaying", function() {
        var state, modelReplay, view, db;

        beforeEach(function(){
            state = {hello: "world"};
            modelReplay = function() {
                var self = this;
                this.state = state;
                this.replayEvent = function(value) {
                    self.state = value;
                };
            };
            view = sinon.stub();
            db = { view: view };
        });

        it("should replay the events into the replayer", function(done) {

            var newState = {"new":"state"};
            view.yields(null, {rows:[
                {value: {
                    event: "replayEvent",
                    value: newState
                }}
            ]});

            var promise = Replayer(db, "testview", modelReplay)("id")

            promise.then(function(actualState){
                actualState.should.equal(newState);
                done();
            }, function(err) {
                done(err);
            });

        });

        it("should fail when the db returns an error", function(done) {

            view.yields(new Error("is this what db returns?"), {rows:[]});

            var promise = Replayer(db, "Testview", modelReplay)("id");

            promise.then(function(actualState){
                actualState.should.not.be.ok;
                done();
            }, function(err) {
                done();
            });
        });

    });
});