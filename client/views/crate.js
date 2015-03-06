Template.crate.helpers({
  buyIconClass: function() {
    if (Session.get("inProgress") === true) {
      return 'fa fa-spinner fa-spin';
    } else {
      return 'fa fa-shopping-cart';
    }
  },
  buyButtonClass: function(context) {
    if (typeof context === 'undefined') {
      return 'btn btn-primary btn-block';
    }
    if (!Meteor.user().profile.balance ||
      Session.get("inProgress") === true ||
      (Meteor.user() && parseFloat(parseFloat(Meteor.user().profile.balance).toFixed(2)) < context)
    ) {
      return 'btn btn-primary btn-block disabled2';
    } else {
      return 'btn btn-primary btn-block';
    }
  }
});

Template.crate.events({
  'click .buy-bottle': function(event) {
    var self = this;
    var buyBottle = function(event) {

      if (Meteor.user().profile.balance < self.pricePerBotle) {
        FlashMessages.sendError({
          text: "insufficient_funds"
        });
      } else if (Session.get("inProgress") !== true) {
        Session.set("inProgress", true);
        Meteor.call("buy-bottle", self._id, function(error, result) {
          if (error && error.reason) {
            FlashMessages.sendError({
              text: error.reason
            });
          } else {
            FlashMessages.sendSuccess({
              text: "bought_a_bottle",
              metadata: {
                what: result.what,
                price: formatCurrency(result.price)
              }
            });
          }
          Session.set("inProgress", false);
        });
      }
      event.preventDefault();
    };
    
    if (!$(event.currentTarget).hasClass("disabled2")) {
      bootbox.dialog({
        message: TAPi18n.__('do_you_want_to_buy_this_bottle', {
          beverage: self.content,
          pricePerBottle: formatCurrency(self.pricePerBottle)
        }),
        title: TAPi18n.__('buy_bottle'),
        buttons: {
          success: {
            label: "<i class=\"fa fa-check\"></i> " + TAPi18n.__('yes'),
            className: "btn-success pull-left",
            callback: function() {
              buyBottle(event);
            }
          },
          danger: {
            label: "<i class=\"fa fa-times\"></i> " + TAPi18n.__('no'),
            className: "btn-danger",
            callback: function() {
              event.preventDefault();
            }
          }
        }
      });
    }
  }
});
