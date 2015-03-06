Meteor.publish("users", function(find, options) {
  find = find || {};
  options = options || {};
  if (!this.userId) {
    return this.ready();
  }

  options = _.extend(options, {
    username: 1,
    createdAt: 1,
    profile: 1,
    "services.resume": 1
  });

  if (Roles.userIsInRole(this.userId, ['users:read'])) {
    return Meteor.users.find(find, options);
  } else {
    return Meteor.users.find(this.userId, options);
  }
});

Meteor.publish("singleUser", function(userId) {
  check(userId, String);
  if (Roles.userIsInRole(this.userId, ['users:read'])) {
    var user = Meteor.users.find({
      _id: userId
    }, {
      username: 1,
      profile: 1,
      createdAt: 1,
      "services.resume": 1
    });
    return user;
  } else {
    return this.ready();
  }
});

Meteor.publish("allUsernames", function(find, options) {
  find = find || {};
  options = options || {};
  if (!this.userId) {
    return this.ready();
  }

  options = _.extend(options, {
    fields: {
      username: 1
    }
  });

  if (Roles.userIsInRole(this.userId, ['users:read'])) {
    return Meteor.users.find(find, options);
  } else {
    return Meteor.users.find(this.userId, options);
  }
});
