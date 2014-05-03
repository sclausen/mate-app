Meteor.publish('news', function() {
  if (Roles.userIsInRole(this.userId, ['news:read'])) {
    return News.find({}, {
      sort: {
        date: -1
      }
    });
  } else if (this.userId) {
    return News.find({
      date: {
        $lte: new Date()
      }
    }, {
      sort: {
        date: -1
      }
    });
  } else {
    return this.ready();
  }
});