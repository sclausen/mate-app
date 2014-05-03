Router.map(function() {
  this.route('crates', {
    path: '/:language?/crates',
    waitOn: function() {
      return Meteor.subscribe("crates")
    },
    action: function() {
      if (this.ready()) {
        this.render();
      }
    },
    data: function() {
      if (this.ready()) {
        var crates = Crates.find({
          depleted: {
            $exists: false
          }
        }, {
          sort: {
            bought: -1
          },
          skip: (this.params.page - 1) * (Session.get("documentsPerPage") || 10),
          limit: (Session.get("documentsPerPage") || 10)
        });

        var pages = getPages(this.params.page, Crates.find({
          depleted: null
        }).count(), Session.get("documentsPerPage"), Session.get("maxSize"));

        return {
          crates: crates,
          pages: pages
        }
      }
    }
  });
});

Template.crates.buyIconClass = function() {
  if (Session.get("inProgress") == true) {
    return 'fa fa-spinner fa-spin';
  } else {
    return 'fa fa-shopping-cart';
  }
}

Template.crates.events({
  'click .buy-bottle': function(event) {
    if (
      Session.get("inProgress") == true ||
      Meteor.user().profile.balance < $(event.currentTarget).attr("pricePerBottle")
    ) {
      return false
    } else {
      Session.set("inProgress", true);
      Meteor.call("buy-bottle", event.currentTarget.value, function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError(error.reason);
        }
        Session.set("inProgress", false);
      });
    }
    event.preventDefault();
  }
});