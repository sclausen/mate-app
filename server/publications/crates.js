Meteor.publish("crates", function(find, options) {
  find = find || {};
  options = options || {};
  if (!this.userId) {
    return this.ready();
  }

  if (!Roles.userIsInRole(this.userId, ['crates:read'])) {
    options = _.extend(options, {
      depleted: {
        $exists: false
      }
    });
  }

  Counts.publish(this, 'crates', Crates.find(find), {
    noReady: true
  });

  return Crates.find(find, options);
});
