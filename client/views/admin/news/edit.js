Template.admin_news_edit.rendered = function() {
  $('.date').datetimepicker({
    pick12HourFormat: false,
    pickSeconds: false,
    language: 'de'
  });
};

Template.admin_news_edit.events({
  'click .save': function(event, target) {
    event.preventDefault();
    var newsId = $(event.currentTarget).attr("id");
    var news = {
      headline: target.find('#headline').value,
      date: moment(target.find('#date').value)._d,
      text: target.find('#text').value,
      locale: target.find('#locale').value
    };
    var cb = function(error) {
      console.log(error);
      if (error && error.reason) {
        FlashMessages.sendError({
          text: error.reason
        });
      } else {
        FlashMessages.sendSuccess({
          text: "Die News ist gespeichert worden"
        });
        Router.go("/admin/news");
      }
    };

    if (newsId) {
      News.update(newsId, {
        $set: news
      }, cb);
    } else {
      News.insert(news, cb);
    }

    // Meteor.call('save-news',
    //   newsId, {
    //     headline: target.find('#headline').value,
    //     date: target.find('#date').value,
    //     text: target.find('#text').value,
    //     locale: target.find('#locale').value
    //   },
    //   function(error) {
    //     if (error && error.reason) {
    //       FlashMessages.sendError(error.reason);
    //     } else {
    //       FlashMessages.sendSuccess("Die News ist gespeichert worden");
    //       Router.go("/admin/news");
    //     }
    //   });
  },
  'click .cancel': function() {
    history.back();
  }
});
