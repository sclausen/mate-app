Transactions = new Meteor.Collection('transactions');

Transactions.deny({
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  insert: function() {
    return true;
  },
  fetch: ['owner']
});