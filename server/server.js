Meteor.methods({
  'accept-terms-and-conditions': function() {
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        'profile.termsAndConditionsAccepted': true
      }
    });
  },
  'get-terms-and-conditions': function(locale) {
    return Pages.findOne({
      locale: locale,
      name: 'termsAndConditions'
    });
  },
  'save-crate': function(options) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['crates:create', 'crates:update'])) {
      FlashMessages.sendError({
        text: 'access_denied',
        userId: this.userId
      });
    }

    check(options.content, String);
    check(options.volume, Number);
    check(options.pricePerBottle, Number);
    check(options.boughtAt, String);
    check(options.roomNo, String);

    if (options.volume === 0) {
      options = _.extend(options, {
        depletedAt: new Date()
      });
    } else if (options.volume > 0) {
      if (options.depletedAt) {
        delete options.depletedAt;
      }
    }

    if (options.depletedAt) {
      options.depletedAt = new Date(moment(options.depletedAt).unix() * 1000);
    }

    options.boughtAt = new Date(moment(options.boughtAt).unix() * 1000);

    if (options._id === undefined || options._id === null || options._id === '') {
      delete options._id;
      Crates.insert(options);
    } else {
      Crates.update({
        _id: options._id
      }, options);
    }
  },
  'save-news': function(newsId, options) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['news:create'])) {
      FlashMessages.sendError({
        text: 'access_denied',
        userId: this.userId
      });
    }

    check(options.headline, String);
    check(options.date, String);
    check(options.text, String);

    options.date = new Date(moment(options.date).unix() * 1000);

    if (newsId === undefined || newsId === null) {
      News.insert(options);
    } else {
      News.update({
        _id: newsId
      }, options);
    }
  },
  'propagate-new-news': function() {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['news:create'])) {
      FlashMessages.sendError({
        text: 'access_denied',
        userId: this.userId
      });
    } else {
      Meteor.users.update({}, {
        $set: {
          "profile.unreadNews": true
        }
      }, {
        multi: true
      });
    }
  },
  'delete-news': function(newsId) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['news:delete'])) {
      FlashMessages.sendError({
        text: 'access_denied',
        userId: this.userId
      });
    }

    News.remove({
      _id: newsId
    });
  },
  'news-read': function() {
    Meteor.users.update({
      _id: this.userId
    }, {
      $unset: {
        "profile.unreadNews": 1
      }
    });
    return true;
  },
  'save-page': function(pageId, options) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['pages:create'])) {
      FlashMessages.sendError({
        text: 'access_denied',
        userId: this.userId
      });
    }

    check(options.title, String);
    check(options.locale, String);
    check(options.name, String);
    check(options.text, String);

    if (pageId === undefined || pageId === null) {
      Pages.insert(options);
    } else {
      Pages.update({
        _id: pageId
      }, options);
    }
  },
  'delete-page': function(pageId) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['pages:delete'])) {
      FlashMessages.sendError({
        text: 'access_denied',
        userId: this.userId
      });
    }

    Pages.remove({
      _id: pageId
    });
  },
  'buy-bottle': function(crateId) {
    check(crateId, String);
    var self = this;

    var user = Meteor.users.findOne({
      _id: self.userId
    });

    var crate = Crates.findOne({
      _id: crateId
    });

    if (!crate) {
      throw new Meteor.Error(404, "Kiste nicht gefunden!");
    }

    if (!user.profile.balance) {
      user.profile.balance = 0;
    }

    if (user.profile.balance < crate.pricePerBottle) {
      FlashMessages.sendError({
        text: 'insufficient_funds',
        userId: this.userId
      });
    } else if (crate.volume < 1) {
      throw new Meteor.Error(404, "Sorry, die kiste ist bereits leer!");
    } else {
      var crateUpdateObject = {
        $inc: {
          volume: -1
        }
      };

      if (crate.volume === 1) {
        crateUpdateObject.$set = {
          depletedAt: new Date()
        };
      }

      Crates.update({
        _id: crateId
      }, crateUpdateObject);

      crate = Crates.findOne({
        _id: crateId
      });

      Meteor.users.update({
        _id: self.userId
      }, {
        $set: {
          'profile.lastBought': {
            when: +moment()
          }
        },
        $inc: {
          'profile.balance': -crate.pricePerBottle,
        }
      });

      Transactions.insert({
        userName: user.username,
        userId: this.userId,
        crate: crate,
        value: -crate.pricePerBottle,
        boughtAt: new Date()
      });

      return {
        what: crate.content,
        price: crate.pricePerBottle
      };
    }
  }
});
