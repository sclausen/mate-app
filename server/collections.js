Messages.allow({
  insert: function(userId, doc) {
    return !!userId && doc.userId === userId;
  },
  update: function(userId, doc) {
    return !!userId && doc.userId === userId;
  },
  remove: function(userId, doc) {
    return !!userId && doc.userId === userId;
  },
  fetch: ['userId']
});

Messages.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
});

Pages.deny({
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
