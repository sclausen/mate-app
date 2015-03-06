Template.admin_consumer_detail.rendered = function() {
  $('#roles').selectize();
};

Template.admin_consumer_detail.helpers({
  roles: function() {
    return Meteor.roles.find({}, {
      sort: {
        name: 1
      }
    });
  },
  userHasRole: function(userId, role) {
    return Roles.userIsInRole(userId, role);
  },
  userName: function() {
    return this.username ? this.username : this.profile.name;
  }
});

Template.admin_consumer_detail.events({
  'click .save': function(event) {
    var userId = $(event.currentTarget).attr("user-id");

    var modifiers = {
      $set: {
        'profile.unreadNews': $("#unreadNews").prop("checked"),
        'profile.termsAndConditionsAccepted': $("#termsAndConditionsAccepted").prop("checked"),
        'roles': $('#roles').val()
      }
    };

    Meteor.users.update(userId, modifiers, function(error) {
      if (error) {
        console.error(error);
      }
      FlashMessages.sendSuccess({
        text: 'profile_saved'
      });
    });
  },
  'click #deposit': function(event) {
    var userId = $(event.currentTarget).attr("user-id");
    var user = Meteor.users.findOne(userId);
    var updateVal = parseInt($(".moneyToUpdate").val(), 10);
    if (user) {
      var modifiers = {
        $inc: {
          'profile.balance': updateVal
        }
      };
      Meteor.users.update(userId, modifiers, function(error) {
        if (error && error.reason) {
          FlashMessages.sendError({
            text: error.reason
          });
        } else {
          Transactions.insert({
            userName: user.username,
            userId: userId,
            value: updateVal,
            type: "deposit",
            boughtAt: new Date()
          });

          FlashMessages.sendSuccess({
            text: 'youve_deposited',
            metadata: {
              amount: formatCurrency($(".moneyToUpdate").val())
            }
          });
        }
      });
    }
    event.preventDefault();
  },
  'click #disbursal': function(event) {
    var userId = $(event.currentTarget).attr("user-id");
    var user = Meteor.users.findOne(userId);
    var updateVal = parseInt($(".moneyToUpdate").val(), 10);
    if (user) {
      var modifiers = {
        $inc: {
          'profile.balance': updateVal * -1
        }
      };
      Meteor.users.update(userId, modifiers, function(error) {
        if (error && error.reason) {
          FlashMessages.sendError({
            text: error.reason
          });
        } else {
          Transactions.insert({
            userName: user.username,
            userId: userId,
            value: updateVal,
            type: "disbursal",
            boughtAt: new Date()
          });

          FlashMessages.sendSuccess({
            text: 'youve_disbursed',
            metadata: {
              amount: formatCurrency($(".moneyToUpdate").val())
            }
          });
        }
      });
    }
    event.preventDefault();
  },
  'click #other-accounting-transaction': function(event) {
    var userId = $(event.currentTarget).attr("user-id");
    var user = Meteor.users.findOne(userId);
    var updateVal = parseInt($(".moneyToUpdate").val(), 10);
    if (user) {
      var modifiers = {
        $inc: {
          'profile.balance': updateVal
        }
      };
      Meteor.users.update(userId, modifiers, function(error) {
        if (error && error.reason) {
          FlashMessages.sendError({
            text: error.reason
          });
        } else {
          Transactions.insert({
            userName: user.username,
            userId: userId,
            value: updateVal,
            type: "other_booking",
            boughtAt: new Date()
          });

          FlashMessages.sendSuccess({
            text: 'youve_booked',
            metadata: {
              amount: formatCurrency($(".moneyToUpdate").val())
            }
          });
        }
      });
    }
    event.preventDefault();
  },
  'click .cancel': function() {
    history.back();
  }
});
