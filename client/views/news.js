var ITEMS_INCREMENT = 3;
Router.map(function() {
  this.route('news', {
    path: '/:language?',
    onRun: function() {
      Session.set('itemsLimit', ITEMS_INCREMENT);
    },
    waitOn: function() {
      return Meteor.subscribe("news", {
        locale: Meteor.getLocale()
      })
    },
    action: function() {
      if (this.ready()) {
        Meteor.call("news-read");
        this.render();
      }
    },
    data: function() {
      if (this.ready()) {
        var news = News.find({
          date: {
            $lte: new Date()
          },
          locale: Meteor.getLocale()
        }, {
          sort: {
            date: -1
          },
          limit: Session.get('itemsLimit')
        });
        return {
          news: news
        }
      }
    }
  });
});

function showMoreVisible() {
  var threshold, target = $('#showMoreResults');
  if (!target.length) return;

  threshold = $(window).scrollTop() + $(window).height() - target.height() + 100;

  if (target.offset().top < threshold) {
    if (!target.data('visible')) {
      // console.log('target became visible (inside viewable area)');
      target.data('visible', true);
      Session.set('itemsLimit',
        Session.get('itemsLimit') + ITEMS_INCREMENT);
    }
  } else {
    if (target.data('visible')) {
      // console.log('target became invisible (below viewable arae)');
      target.data('visible', false);
    }
  }
}

Template.news.rendered = function() {
  showMoreVisible();
  $(window).scroll(showMoreVisible);
}

Template.news.moreResults = function() {
  return !(News.find({
    locale: Meteor.getLocale(),
    date: {
      $lte: new Date()
    }
  }).fetch().length < Session.get('itemsLimit'));
}