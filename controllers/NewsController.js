NewsController = InfiniteScrollingController.extend({
  increment: 1,
  onAfterAction: function() {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.unreadNews": false
      }
    });
  },
  subscriptions: function() {
    return subs.subscribe('news', {
      locale: Session.get('locale'),
      date: {
        $lte: new Date()
      }
    }, {
      sort: {
        date: -1
      },
      limit: this.limit()
    });
  },
  news: function() {
    return News.find({
      locale: Session.get('locale'),
      date: {
        $lte: new Date()
      }
    }, {
      sort: {
        date: -1
      },
      limit: this.limit()
    });
  },
  data: function() {
    return {
      news: this.news(),
      ready: this.ready()
    };
  },
  count: function() {
    return Counts.get('all-news');
  }
});
