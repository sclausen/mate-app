CratesController = InfiniteScrollingController.extend({
  increment: 10,
  waitOn: function() {
    return subs.subscribe("crates", {
      depletedAt: {
        $exists: false
      }
    }, {
      sort: {
        boughtAt: -1
      },
      limit: this.limit()
    });
  },
  crates: function() {
    var crates = Crates.find({
      depletedAt: {
        $exists: false
      }
    }, {
      sort: {
        boughtAt: -1
      },
      limit: this.limit()
    });

    return crates;
  },
  data: function() {
    return {
      crates: this.crates(),
      ready: this.ready()
    };
  },
  count: function() {
    return Counts.get('crates');
  }
});
