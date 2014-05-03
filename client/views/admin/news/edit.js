Router.map(function() {
  this.route('admin_news_edit', {
    path: '/:language?/admin/news/:_id',
    waitOn: function() {
      return Meteor.subscribe("news");
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['news:create', 'news:update'])) {
        this.redirect('/');
      }
    },
    data: function() {
      return News.findOne({
        _id: this.params._id
      });
    }
  });
});

Template.admin_news_edit.rendered = function() {
  $('.date').datetimepicker({
    pick12HourFormat: false,
    pickSeconds: false,
    language: 'de'
  });
}

Template.admin_news_edit.events({
  'click .save': function(event, target) {
    var newsId = $(event.currentTarget).attr("id");
    Meteor.call('save-news',
      newsId, {
        headline: target.find('#headline').value,
        locale: target.find('#locale').value,
        date: target.find('#date').value,
        text: target.find('#text').value
      },
      function(error) {
        if (error && error.reason) {
          FlashMessages.sendError(error.reason);
        } else {
          FlashMessages.sendSuccess("Die News ist gespeichert worden");
          history.back();
        }
      });
  },
  'click .cancel': function() {
    history.back();
  }
});