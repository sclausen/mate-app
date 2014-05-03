Router.map(function() {
  this.route('login', {
    onBeforeAction: function() {
      if (Meteor.user()) {
        this.redirect("news")
      }
    }
  });
});

Template.login.events({
  'click .login': function() {
    if (!Meteor.user()) {
      NProgress.start();
      Meteor.loginWithGithub(function(error, response) {
        NProgress.done();
        if (error) {
          FlashMessages.sendError(error.reason);
        } else if (response && response.error) {
          FlashMessages.sendError(response.reason);
        }
      });
    }
  }
});