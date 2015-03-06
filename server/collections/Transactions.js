Transactions.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!userId && Roles.userIsInRole(user, ['transactions:create']);
  }
});
