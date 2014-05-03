Accounts.onCreateUser(function(options, user) {
  user.username = user.services.github.username;
  user._id = user.services.github.id.toString();
  user.profile = {
    balance: 0,
    created: user.createdAt,
    unreadNews: true,
    termsAndConditionsAccepted: false
  };
  return user;
});

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
  'add-crate': function(options) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['crates:create'])) {
      throw new Meteor.Error(403, "access_denied");
    }

    check(options.content, String);
    check(options.volume, Number);
    check(options.pricePerBottle, Number);
    check(options.bought, String);
    check(options.roomNo, String);
    check(options.buyerName, String);

    var newCrate = {
      content: options.content,
      volume: options.volume,
      pricePerBottle: options.pricePerBottle,
      bought: new Date(+moment(options.bought)),
      roomNo: options.roomNo,
      buyerName: options.buyerName
    };

    Crates.insert(newCrate);

    return newCrate;
  },
  'save-crate': function(options) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['crates:create', 'crates:update'])) {
      throw new Meteor.Error(403, "access_denied");
    }

    check(options.content, String);
    check(options.volume, Number);
    check(options.pricePerBottle, Number);
    check(options.bought, String);
    check(options.roomNo, String);

    if (options.volume == 0) {
      options = _.extend(options, {
        depleted: new Date()
      });
    } else if (options.volume > 0) {
      if (options.depleted) {
        delete options.depleted;
      }
    }

    if (options.depleted) {
      options.depleted = new Date(moment(options.depleted).unix() * 1000);
    }

    options.bought = new Date(moment(options.bought).unix() * 1000);

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
      throw new Meteor.Error(403, "access_denied");
    }

    check(options.headline, String);
    check(options.locale, String);
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
      throw new Meteor.Error(403, "access_denied");
    }

    Meteor.users.update({}, {
      $set: {
        "profile.unreadNews": true
      }
    }, {
      multi: true
    });
  },
  'delete-news': function(newsId) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['news:delete'])) {
      throw new Meteor.Error(403, "access_denied");
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
      throw new Meteor.Error(403, "access_denied");
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
      throw new Meteor.Error(403, "access_denied");
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

    if (user.profile.balance < crate.pricePerBottle) {
      throw new Meteor.Error(402, "insufficient_funds");
    } else if (crate.volume < 1) {
      throw new Meteor.Error(404, "Sorry, die kiste ist bereits leer!");
    } else {

      Meteor.users.update({
        _id: self.userId
      }, {
        $set: {
          'profile.balance': user.profile.balance - crate.pricePerBottle,
          'profile.lastBought': {
            when: +moment()
          }
        }
      });

      var crateUpdateObject = {
        $inc: {
          volume: -1
        }
      };

      if (crate.volume === 1) {
        crateUpdateObject.$set = {
          depleted: new Date()
        };
      }

      Crates.update({
        _id: crateId
      }, crateUpdateObject);

      crate = Crates.findOne({
        _id: crateId
      });

      Transactions.insert({
        userName: user.username,
        userId: this.userId,
        crate: crate,
        value: -crate.pricePerBottle,
        bought: new Date()
      });

      return true;
    }
  },
  'update-money-relative': function(userId, value, type) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['users:update'])) {
      throw new Meteor.Error(403, "access_denied");
    }

    check(type, String);
    value = value * 100;

    var user = Meteor.users.findOne({
      _id: userId
    });
    if (
      (
        value < 0 &&
        user.profile.balance + value >= 0
      ) || value > 0
    ) {
      Transactions.insert({
        userName: user.username,
        userId: user._id,
        value: value,
        type: type,
        bought: new Date()
      });

      return Meteor.users.update({
        _id: userId
      }, {
        $set: {
          'profile.balance': user.profile.balance + value
        }
      });
    } else {
      throw new Meteor.Error(409, "admin_consumer_negative_balance_forbidden");
    }
  },
  'admin-save-user': function(options) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['users:update'])) {
      throw new Meteor.Error(403, "access_denied");
    }

    check(options.userId, String);
    check(options.unreadNews, Boolean);
    check(options.termsAndConditionsAccepted, Boolean);

    var user = Meteor.users.findOne({
      _id: options.userId
    });

    var changedFields = {};

    if (user.profile.unreadNews != options.unreadNews) {
      changedFields["profile.unreadNews"] = options.unreadNews;
    }

    if (user.profile.termsAndConditionsAccepted != options.termsAndConditionsAccepted) {
      changedFields["profile.termsAndConditionsAccepted"] = options.termsAndConditionsAccepted;
    }

    changedFields["roles"] = options.roles;


    Meteor.users.update({
      _id: options.userId
    }, {
      $set: changedFields
    });
    return Meteor.users.findOne({
      _id: options.userId
    }, {
      username: 1,
      profile: 1,
      "services.resume": 1
    });
  }
});