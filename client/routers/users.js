Router.map(function() {
  this.route('verify', {
    action: function() {
      var self = this;
      NProgress.start();
      if (!Meteor.user()) {
        Meteor.loginWithOpenID(self.path, self.params['openid.op_endpoint'], function(err) {
          NProgress.done();
          if (err) {
            FlashMessages.sendError(err.reason || err);
          } else {
            self.redirect("news")
          }
        });
      }
    }
  });
  this.route('logout', {
    template: "login",
    onAfterAction: function() {
      var self = this;
      Meteor.logout(function(error) {
        if (error && error.reason) {
          FlashMessages.sendError(error.reason);
        }
        self.redirect("login")
      });
    }
  });
});