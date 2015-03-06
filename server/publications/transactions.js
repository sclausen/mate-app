Meteor.publish("transactions", function(find, options) {
  find = find || {};
  options = options || {};
  if (!this.userId) {
    return this.ready();
  }

  if (!Roles.userIsInRole(this.userId, ['transactions:read'])) {
    find = _.extend(find, {
      userId: this.userId
    });
  }
  
  Counts.publish(this, 'transactions', Transactions.find(find, {
    noReady: true
  }));

  return Transactions.find(find, options);
});
