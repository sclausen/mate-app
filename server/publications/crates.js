Meteor.publish("crates", function() {
  if (Roles.userIsInRole(this.userId, ['crates:read'])) {
    return Crates.find({});
  } else if (this.userId) {
    return Crates.find({
      depleted: {
        $exists: false
      }
    });
  } else {
    return this.ready();
  }
});