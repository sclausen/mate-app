AdminNewsEditController = RouteController.extend({
  waitOn: function() {
    return subs.subscribe('newsSingle', this.params._id);
  },
  onBeforeAction: function() {
    if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['news:create', 'news:update'])) {
      this.redirect('/');
    }
    this.next();
  },
  data: function() {
    var news = News.findOne(this.params._id);

    return news;
  }
});
