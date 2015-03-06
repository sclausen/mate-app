AdminConsumersController = InfiniteScrollingController.extend({
  increment: 10,
  onBeforeAction: function() {
    if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['users:read'])) {
      this.redirect('/');
    }
    this.next();
  },
  subscriptions: function() {
    return [subs.subscribe('users', {}, {
      sort: {
        username: 1
      },
      limit: this.limit()
    })];
  },
  waitOn: function() {
    return subs.subscribe('allUsernames');
  },
  consumers: function() {
    return Meteor.users.find({}, {
      sort: {
        username: 1
      },
      limit: this.limit()
    });
  },
  allConsumers: function() {
    return Meteor.users.find({}, {
      sort: {
        'username': 1
      }
    });
  },
  data: function() {
    return {
      consumers: this.consumers(),
      allConsumers: this.allConsumers(),
      ready: this.ready()
    };
  },
  count: function() {
    return this.allConsumers().count();
  }
});
