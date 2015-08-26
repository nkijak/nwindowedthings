module.exports = function(who, what, count, when) {
  return {
    user: who,
    type: what,
    count: count,
    when: when || Date.now()
  };
};
