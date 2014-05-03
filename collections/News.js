News = new Meteor.Collection('news');

News.deny({
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