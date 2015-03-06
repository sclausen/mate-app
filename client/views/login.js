Template.login.events({
  // 'click .loginOpenID': function() {
  //   if (!Meteor.user()) {
  //     NProgress.start();
  //     Meteor.call("authenticate", function(error, response) {
  //       NProgress.done();
  //       if (error) {
  //         FlashMessages.sendError(error.reason);
  //       } else if (response.error) {
  //         FlashMessages.sendError(response.reason);
  //       } else if (response.authUrl) {
  //         window.location.href = response.authUrl;
  //       }
  //     });
  //   }
  // },
  'click .loginBGx': function() {
    if (!Meteor.user()) {
      NProgress.start();
      Meteor.loginWithBgx({
        requestPermissions: ['user']
      }, function(error) {
        NProgress.done();
        if (error) {
          FlashMessages.sendError(error.message);
        }
      });
    }
  }
});

Template.login.helpers({
  showLoginButtons: function(){
    return Session.get('showLoginButtons');
  }
});
