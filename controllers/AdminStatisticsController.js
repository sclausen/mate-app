AdminStatisticsController = RouteController.extend({
  waitOn: function() {
    return [
      subs.subscribe("users"),
      subs.subscribe("transactions")
    ];
  },
  onBeforeAction: function() {
    if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['statistics:read'])) {
      this.redirect('/');
    } else {
      this.next();
    }
  },
  data: function() {
    var transactions = Transactions.find({
      crate: {
        $exists: true
      }
    }).fetch();
    return {
      transactions: transactions
    };
  }
});
