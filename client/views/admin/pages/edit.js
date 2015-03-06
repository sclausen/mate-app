Template.admin_page_edit.events({
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
          FlashMessages.sendError({
            text: error.reason
          });
        } else {
          FlashMessages.sendSuccess({
            text: "page_saved"
          });
          Router.go("admin_pages");
        }
      });
  },
  'click .cancel': function() {
    history.back();
  }
});
