Crates.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!userId && Roles.userIsInRole(user, ['crates:create']);
  },
  update: function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!userId && Roles.userIsInRole(user, ['crates:update']);
  },
  remove: function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!userId && Roles.userIsInRole(user, ['crates:delete']);
  }
});

Crates.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
});
