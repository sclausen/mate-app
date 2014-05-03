Meteor.publish('transactions', function() {
  if (Roles.userIsInRole(this.userId, ['transactions:read'])) {
    return Transactions.find({}, {
      sort: {
        bought: -1
      }
    });
  } else if (this.userId) {
    return Transactions.find({
      userId: this.userId
    }, {
      sort: {
        bought: -1
      }
    });
  } else {
    this.ready();
  }
});