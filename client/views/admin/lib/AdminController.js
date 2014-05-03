AdminController = RouteController.extend({
  action: function() {
    if (this.ready()) {
      this.render();
    }
  },
  onBeforeAction: function() {
    if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['admin'])) {
      this.redirect('/');
    }
  }
});