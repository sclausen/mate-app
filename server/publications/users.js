Meteor.publish("users", function() {
  if (Roles.userIsInRole(this.userId, ['users:read'])) {
    var users = Meteor.users.find({}, {
      'username': 1,
      'profile': 1,
      "services.resume": 1
    });
    return users;
  } else if (this.userId) {
    return Meteor.users.find(this.userId, {
      fields: {
        'username': 1,
        'profile': 1,
        "services.resume": 1
      }
    });
  } else {
    return this.ready();
  }
});

Meteor.publish("singleUser", function(userId) {
  check(userId, String);
  if (Roles.userIsInRole(this.userId, ['users:read'])) {
    var user = Meteor.users.find({
      _id: userId
    }, {
      fields: {
        'username': 1,
        'profile': 1,
        "services.resume": 1
      }
    });
    return user;
  } else {
    return this.ready();
  }
});