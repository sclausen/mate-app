TransactionsController = InfiniteScrollingController.extend({
  increment: 10,
  subscriptions: function() {
    return [
      subs.subscribe("users"),
      subs.subscribe("transactions", {
        userId: Meteor.userId()
      }, {
        sort: {
          boughtAt: -1
        },
        limit: this.limit()
      })
    ];
  },
  transactions: function() {
    var transactions = Transactions.find({
      userId: Meteor.userId()
    }, {
      sort: {
        boughtAt: -1
      },
      limit: this.limit()
    });

    transactions = transactions.map(function(tx) {
      if (tx.crate) {
        tx.crate.boughtAtFormatted = dateFormat(tx.crate.boughtAt);
        tx.crate.pricePerBottleFormatted = formatCurrency(tx.crate.pricePerBottle);
      }
      return tx;
    });
    return transactions;
  },
  data: function() {
    return {
      transactions: this.transactions(),
      ready: this.ready()
    };
  },
  count: function() {
    return Counts.get("transactions");
  }
});
