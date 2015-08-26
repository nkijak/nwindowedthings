var _ = require('underscore');

function Frame(data, frame, goal, now) {
  function filtered() {
    return data.filter(function(d) { 
      return d.when.getTime() + frame >= now;
    });
  }
  this.filtered = filtered;

  this.count = function() {
    return filtered().reduce(function(acc, d) { return acc + d.count; }, 0);
  }

  this.remaining = function() {
    return goal - this.count();
  }

  this.nextDrop = function() {
    var earliest = _.head(filtered().sort(function(d) { return d.when; }));
    return earliest ? earliest.when : Date.now();
  }

  this.rate = function() {
    var ordered = _.pluck(filtered(), "when").sort();
    var earliest = _.first(ordered)
    var latest = _.last(ordered);
    var deltaT = latest - earliest;

    return this.count() / deltaT * 1000;
  }

  this.required = function(now) {
    now = now || Date.now()
    var remainingT = this.nextDrop() - now;

    return this.remaining() / remainingT * 1000;
  }

}

module.exports = Frame;
