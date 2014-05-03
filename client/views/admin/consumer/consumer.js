Router.map(function() {
  this.route('admin_consumer', {
    path: '/:language?/admin/consumers/:_id',
    waitOn: function() {
      return Meteor.subscribe("singleUser", this.params._id)
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['users:update'])) {
        this.redirect('/');
      }
    },
    data: function() {
      var user = Meteor.users.findOne({
        _id: this.params._id
      });
      if (user === undefined) return null;
      return user;
    }
  });
});

Template.admin_consumer.rendered = function() {
  $('#roles').selectize();
};

Template.admin_consumer.roles = function() {
  return Meteor.roles.find({}, {
    sort: {
      name: 1
    }
  });
};

Template.admin_consumer.helpers({
  'userHasRole': function(userId, role) {
    return Roles.userIsInRole(userId, role);
  }
});

Template.admin_consumer.events({
  'click .save': function(event) {
    var userId = $(event.currentTarget).attr("user-id");

    var options = {
      userId: userId,
      username: $("#inputUsername").val(),
      unreadNews: $("#unreadNews").prop("checked"),
      termsAndConditionsAccepted: $("#termsAndConditionsAccepted").prop("checked"),
      roles: $('#roles').val()
    }

    Meteor.call(
      "admin-save-user",
      options,
      function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError(__(error.reason));
        } else {
          Router.go("admin_consumers", {
            language: Meteor.getLocale()
          });
          FlashMessages.sendSuccess(__("profile_saved"));
        }
        $("html, body").animate({
          scrollTop: 0
        }, "fast");
      }
    );
  },
  'click #deposit': function(event) {
    Meteor.call(
      "update-money-relative",
      $(event.currentTarget).attr("user-id"),
      $(".moneyToUpdate").val(),
      "Einzahlung",
      function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError(__(error.reason));
        } else {
          FlashMessages.sendSuccess(__("youve_deposited", {
            amount: formatCurrency($(".moneyToUpdate").val() * 100)
          }));
        }
        $("html, body").animate({
          scrollTop: 0
        }, "fast");
      }
    );
    event.preventDefault();
  },
  'click #disbursal': function(event) {
    Meteor.call(
      "update-money-relative",
      $(event.currentTarget).attr("user-id"),
      $(".moneyToUpdate").val() * -1,
      "Auszahlung",
      function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError(__(error.reason));
        } else {
          FlashMessages.sendSuccess(__("youve_disbursed", {
            amount: formatCurrency($(".moneyToUpdate").val() * 100)
          }));
        }
        $("html, body").animate({
          scrollTop: 0
        }, "fast");
      }
    );
    event.preventDefault();
  },
  'click #other-accounting-transaction': function(event) {
    Meteor.call(
      "update-money-relative",
      $(event.currentTarget).attr("user-id"),
      $(".moneyToUpdate").val(),
      "Andere Buchung",
      function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError(__(error.reason));
        } else {
          FlashMessages.sendSuccess(__("youve_booked", {
            amount: formatCurrency($(".moneyToUpdate").val() * 100)
          }));
        }
        $("html, body").animate({
          scrollTop: 0
        }, "fast");
      }
    );
    event.preventDefault();
  },
  'click .cancel': function() {
    history.back();
  }
});