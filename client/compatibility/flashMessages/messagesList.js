Template.flashMessages.helpers({
  messages: function() {
    if (Messages.find().count() && FlashMessages.options.autoScroll) {
/*
      $('html, body').animate({
        scrollTop: 0
      }, 200);*/

    }

    return Messages.find().fetch();
  }
});

Template.flashMessageItem.rendered = function() {
  var message = this.data;

  Meteor.defer(function() {
    Messages.update(message._id, {
      $set: {
        seen: true
      }
    });
  });
/*
  Meteor.setTimeout(function() {
    Messages.remove(message._id);
  }, message.hideDelay || 5000);*/

  if (message.autoHide) {
    $alert = $(this.find('.alert'));

    $alert.delay(message.hideDelay).fadeOut(400, function() {
      Messages.remove({
        _id: message._id
      });
    });

  }
};

Template.flashMessageItem.events({
  "click .close": function(e, tmpl) {
    e.preventDefault();
    Messages.remove(tmpl.data._id);
  }
});
