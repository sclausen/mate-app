Template.admin_news.events({
  'click .close': function(event) {
    Meteor.call('delete-news',
      $(event.currentTarget).attr("id"),
      function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError({
            text: error.reason
          });
        } else {
          FlashMessages.sendSuccess({
            text: "Die News wurde gelöscht!"
          });
        }
      });
  },
  'click .propagate-new-news': function(event) {
    event.preventDefault();

    Meteor.call('propagate-new-news', function(error) {
      if (error && error.reason) {
        FlashMessages.sendError({
          text: error.reason
        });
      } else {
        FlashMessages.sendInfo({
          text: "Die Benutzer sehen jetzt, dass es eine neue News gibt!"
        });
      }
    });
  }
});

Template.admin_news.helpers({
  moreResults: function() {
    var ctrl = Iron.controller();
    return ctrl.state.get('limit') < ctrl.count();
  }
});

Template.admin_news.events({
  'click #showMoreResults': function(e) {
    e.preventDefault();
    var ctrl = Iron.controller();
    ctrl.state.set('limit', ctrl.state.get('limit') + ctrl.increment);
  }
});
