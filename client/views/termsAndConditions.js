Meteor.subscribe("pages", {
  name: "termsAndConditions",
  locale: Meteor.getLocale()
});

Template.termsAndConditions.helpers({
  data: function() {
    return Pages.findOne({
      name: "termsAndConditions",
      locale: Meteor.getLocale()
    });
  }
});

Template.termsAndConditions.events({
  'click .accept': function() {
    Meteor.call('accept-terms-and-conditions', function(error, result) {
      if (error && error.reason) {
        FlashMessages.sendError(error.reason);
      }
      Router.go("news", {
        language: Meteor.getLocale()
      });
    });
  }
});