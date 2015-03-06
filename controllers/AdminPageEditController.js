AdminPageEditController = RouteController.extend({
  waitOn: function() {
    return subs.subscribe('pageSingle', this.params._id);
  },
  onBeforeAction: function() {
    if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['pages:create', 'pages:update'])) {
      this.redirect('/');
    }
    this.next();
  },
  data: function() {
    var page = Pages.findOne(this.params._id);

    return page;
  }
});
