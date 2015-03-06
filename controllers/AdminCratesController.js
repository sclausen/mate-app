AdminCratesController = InfiniteScrollingController.extend({
  increment: 10,
  onBeforeAction: function() {
    if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['crates:read', 'crates:write'])) {
      this.redirect('/');
    }
    this.next();
  },
  subscriptions: function() {
    return subs.subscribe('crates', {}, {
      limit: this.limit()
    });
  },
  crates: function() {
    return Crates.find({}, {
      limit: this.limit()
    });
  },
  data: function() {
    return {
      crates: this.crates(),
      ready: this.ready()
    };
  },
  count: function() {
    return Counts.get('crates');
  }
});
