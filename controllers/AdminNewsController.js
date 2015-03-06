AdminNewsController = InfiniteScrollingController.extend({
  increment: 1,
  subscriptions: function() {
    return subs.subscribe('news', {}, {
      sort: {
        date: -1
      },
      limit: this.limit()
    });
  },
  news: function() {
    return News.find({}, {
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
