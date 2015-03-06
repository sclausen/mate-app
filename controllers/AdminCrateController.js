AdminCrateController = RouteController.extend({
  waitOn: function() {
    return [
      subs.subscribe("users"),
      subs.subscribe("transactions", {
        "crate._id": this.params._id
      }),
      subs.subscribe("crates", {
        _id: this.params._id
      }, {
        sort: {
          boughtAt: -1
        }
      })
    ];
  },
  onBeforeAction: function() {
    if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['crates:read'])) {
      this.redirect('/');
    } else {
      this.next();
    }
  },
  data: function() {
    var crate = Crates.findOne(this.params._id);

    var transactions = Transactions.find({
      "crate._id": this.params._id
    }, {
      sort: {
        boughtAt: -1
      }
    });

    transactions = transactions.map(function(tx) {
      if (tx.crate) {
        tx.crate.boughtAtFormatted = dateFormat(tx.crate.boughtAt);
        tx.crate.pricePerBottleFormatted = formatCurrency(tx.crate.pricePerBottle);
      }
      return tx;
    });

    var consumers = Meteor.users.find({}, {
      sort: {
        username: 1
      }
    }).fetch();

    return {
      transactions: transactions || [],
      crate: crate || null,
      consumers: consumers || []
    };
  }
});
