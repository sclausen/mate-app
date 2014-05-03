Router.map(function() {
  this.route('admin_news', {
    path: '/:language?/admin/news',
    waitOn: function() {
      return Meteor.subscribe("news")
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['news:read'])) {
        this.redirect('/');
      }
    },
    data: function() {
      var news = News.find({}, {
        sort: {
          date: -1
        },
        skip: (this.params.page - 1) * 3,
        limit: 3
      });

      var pages = getPages(this.params.page, News.find({}).count(), 3, Session.get("maxSize"));

      return {
        news: news,
        pages: pages
      }
    }
  });
});

Template.admin_news.events({
  'click .close': function(event) {
    Meteor.call('delete-news',
      $(event.currentTarget).attr("id"),
      function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError(error.reason);
        } else {
          FlashMessages.sendSuccess("Die News wurde gelöscht!");
        }
      });
  },
  'click .propagate-new-news': function() {
    Meteor.call('propagate-new-news', function(error) {
      if (error && error.reason) {
        FlashMessages.sendError(error.reason);

      } else {
        FlashMessages.sendInfo("Die Benutzer sehen jetzt, dass es eine neue News gibt!");
      }
    });
  }
});