var Frame = require('../../../command/model/frame'),
    record = require('../../../command/model/record'),
    should = require('should')
    ;

var data = [
  record('nick', 'pushups', 2, new Date('2015-08-25T12:34-0400')),
  record('nick', 'pushups', 3, new Date('2015-08-25T12:44-0400')),
  record('nick', 'pushups', 5, new Date('2015-08-25T13:34-0400')),
  record('nick', 'pushups', 1, new Date('2015-08-25T14:34-0400'))
];
var hours24 = 24 * 60 * 60 * 1000;
var frame = new Frame(data, hours24, 11, new Date('2015-08-25T14:35-0400'));

describe.only("Time Frame", function(){
  describe("calculating rate", function() {
    it("should calculate required rate", function() {    
      var frame = new Frame(data, hours24, 11, new Date('2015-08-25T14:35-0400'));
      Math.abs(frame.required(new Date('2015-08-25T14:35-0400'))).should.eql(0);
    });

    it("should filter and calculate", function() {
      var frame = new Frame(data, hours24, 10, new Date('2015-08-26T12:43-0400'));
      frame.required(new Date('2015-08-26T12:43-0400')).should.eql(1/60000);
    });
  });

  describe("count", function() {
    it("should calculate the sum", function() {
      var frame = new Frame(data, hours24, 11, new Date('2015-08-25T14:35-0400'));
      frame.count().should.eql(11);
    });
  });

  describe("filter", function() {
    it("should filter by windo", function() {
      var frame = new Frame(data, hours24, 11, new Date('2015-08-26T12:35-0400'));
      frame.filtered().should.have.length(3);
    });
  });

  describe("nextDrop", function() { 
    it("should return the oldest value", function() {
      var frame = new Frame(data.reverse(), hours24, 100, new Date('2015-08-25T14:35-0400'));
      frame.nextDrop().should.eql(new Date('2015-08-25T12:34-0400'));
    });

    it("Should filter for oldest value", function(){ 
      var frame = new Frame(data, hours24, 10, new Date('2015-08-26T12:43-0400'));
      frame.nextDrop().should.eql(new Date('2015-08-25T12:44-0400'));
    });

  });
});
