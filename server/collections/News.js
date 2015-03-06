News.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!userId && Roles.userIsInRole(user, ['news:create']);
  },
  update: function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!userId && Roles.userIsInRole(user, ['news:update']);
  },
  remove: function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!userId && Roles.userIsInRole(user, ['news:delete']);
  }
});

News.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
});

News.before.update(function(userId, doc) {
  doc.updatedAt = new Date();
});
