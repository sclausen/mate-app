Router.map(function() {
  this.route('admin_pages_edit', {
    path: '/:language?/admin/pages/:_id',
    waitOn: function() {
      return Meteor.subscribe("pages");
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['pages:create', 'pages:update'])) {
        this.redirect('/');
      }
    },
    data: function() {
      return Pages.findOne({
        _id: this.params._id
      });
    },
  });
});

Template.admin_pages_edit.events({
  'click .save': function(event, target) {
    var newsId = $(event.currentTarget).attr("id");
    Meteor.call('save-page',
      newsId, {
        title: target.find('#title').value,
        locale: target.find('#locale').value,
        name: target.find('#name').value,
        text: target.find('#text').value
      },
      function(error) {
        if (error && error.reason) {
          FlashMessages.sendError(error.reason);
        } else {
          FlashMessages.sendSuccess(__("page_saved"));
          Router.go("admin_pages");
        }
      });
  },
  'click .cancel': function() {
    history.back();
  }
});