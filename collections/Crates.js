Crates = new Meteor.Collection('crates');

Crates.deny({
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  insert: function() {
    return true;
  },
  fetch: ['owner']
});