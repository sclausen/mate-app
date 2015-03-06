AdminPagesController = InfiniteScrollingController.extend({
  increment: 20,
  subscriptions: function() {
    return subs.subscribe('pages', {}, {
      sort: {
        date: -1
      },
      limit: this.limit()
    });
  },
  pages: function() {
    return Pages.find({}, {
      sort: {
        date: -1
      },
      limit: this.limit()
    });
  },
  data: function() {
    return {
      pages: this.pages(),
      ready: this.ready()
    };
  },
  count: function() {
    return Counts.get('all-pages');
  }
});
