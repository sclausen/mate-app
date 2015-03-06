Meteor.publish('news', function(find, options) {
  if (!this.userId) {
    return this.ready();
  }
  options = _.isObject(options) ? options : {};
  
  Counts.publish(this, 'all-news', News.find(find), {
    noReady: true
  });
  
  if (!Roles.userIsInRole(this.userId, ['news:read'])) {
    find = _.extend(find, {
      date: {
        $lte: new Date()
      }
    });
  }

  return News.find(find, options);
});

Meteor.publish('newsSingle', function(newsId, options) {
  if (!this.userId) {
    return this.ready();
  }
  options = _.isObject(options) ? options : {};

  var find = {
    _id: newsId
  };

  if (!Roles.userIsInRole(this.userId, ['news:read'])) {
    find = _.extend(find, {
      date: {
        $lte: new Date()
      }
    });
  }

  return News.find(find, options);
});
