Accounts.onCreateUser(function(options, user) {
  //grant the first user on the application admin rights
  if (Meteor.users.find().count() <= 0) {
    user.roles = ["admin", "users:read", "users:update"];
  }

  if (options.profile && options.profile.name) {
    user.username = options.profile.name;
  }

  if (options.profile) {
    user.profile = options.profile;
  }

  return user;
});

function dateBetween(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomCrate() {
  return Random.choice(Crates.find({
    depleted: null
  }, {
    sort: {
      boughtAt: 1
    }
  }).fetch());
}

mockPages = function() {
  var pages = [{
    "title": "Wie funktioniert das Ganze?",
    "locale": "de",
    "name": "help",
    "text": "Nach der Registrierung gehst Du zu einem Administrator der App und zahlst einen beliebigen Betrag bei ihm ein. Wenn Du nun zum Beispiel eine Flasche „Club-Mate” trinken möchtest, klickst Du **zuerst** auf „Kaufen” und gehst **nachfolgend** zu der Kiste und holst Dir Deine Flasche."
  }, {
    "name": "help",
    "title": "How does stuff work?",
    "locale": "en",
    "text": "After your registration you should visit the administrator and deposit any amount of money. If you want to consume a beverage, you have to **first** click on the buy button and **then** you can take the beverage out of the crate."
  }, {
    "title": "Impressum",
    "locale": "de",
    "name": "legalnotice",
    "text": "<p>Es wird versichert, dass die Anwendung unter größter Sorgfalt erstellt und gewartet wird. Ihr erklärt Ihr euch mit der Benutzung dieses Services einverstanden, dass der Betreiber keinerlei Haftung für etwaige materielle und immaterielle Verluste übernimmt. Dies gilt insbesondere für die Kontostände. Des Weiteren wird versichert, dass keinerlei Daten an Dritte übermittelt werden. Da die Kisten im Voraus gekauft werden, kann bei Rücktritt keine Erstattung des Guthabens erfolgen.</p>" +
      "<p>Die Verwendung des Logos wurde implizit von der Brauerei Loscher GmbH & Co. KG auf deren Webseite genehmigt.</p>" +
      "<p>Die Kontaktadresse für jedwege Belange um die Anwendung ist <a href=\"mailto:info@mate-app.de\">info@mate-app.de</a></p>"
  }, {
    "title": "Legal Notice",
    "locale": "en",
    "name": "legalnotice",
    "text": "<p>Es wird versichert, dass die Anwendung unter größter Sorgfalt erstellt und gewartet wird. Ihr erklärt Ihr euch mit der Benutzung dieses Services einverstanden, dass der Betreiber keinerlei Haftung für etwaige materielle und immaterielle Verluste übernimmt. Dies gilt insbesondere für die Kontostände. Des Weiteren wird versichert, dass keinerlei Daten an Dritte übermittelt werden. Da die Kisten im Voraus gekauft werden, kann bei Rücktritt keine Erstattung des Guthabens erfolgen.</p>" +
      "<p>Die Verwendung des Logos wurde implizit von der Brauerei Loscher GmbH & Co. KG auf deren Webseite genehmigt.</p>" +
      "<p>Die Kontaktadresse für jedwege Belange um die Anwendung ist <a href=\"mailto:info@mate-app.de\">info@mate-app.de</a></p>"
  }, {
    "title": "Allgemeine Geschäftsbedingungen",
    "locale": "de",
    "name": "termsAndConditions",
    "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. \n\nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit.\n\nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
  }, {
    "title": "Terms and Conditions",
    "locale": "en",
    "name": "termsAndConditions",
    "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. \n\nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit.\n\nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
  }];
  Pages.remove({});
  _.each(pages, function(page) {
    Pages.insert(page);
  });
  console.log("pages mocked");
};

mockRoles = function(cb) {
  var roles = {
    users: ["read", "update"],
    pages: ["read", "create", "update", "delete"],
    news: ["read", "create", "update", "delete"],
    crates: ["create", "read", "update"],
    transactions: ["read", "create"],
    translations: ["read"],
    statistics: ["read"]
  };

  Meteor.roles.remove({});

  Roles.createRole("admin");

  _.each(Object.keys(roles), function(group) {
    _.each(roles[group], function(action) {
      var role = group + ":" + action;
      Roles.createRole(role);
    });
  });

  if (cb) {
    cb();
  }

  console.log("roles mocked");
};

mockUsers = function(userCount, cb) {
  if (!userCount) {
    userCount = 30;
  }

  Meteor.users.remove({});
  for (var i = 0; i < userCount; i++) {
    var username = GermanMocker().getRandomUserName();
    if (!Meteor.users.findOne({
        username: username
      })) {
      Meteor.users.insert({
        username: username,
        createdAt: new Date(),
        profile: {
          balance: rfb(1, 30, 0) * 100,
          termsAndConditionsAccepted: true,
        }
      });
    }
  }
  console.log("mocking users finished");
  if (cb) {
    cb();
  }
};

mockCrates = function(crateCount, cb) {
  if (!crateCount) {
    crateCount = 5;
  }

  Crates.remove({});
  for (var i = 1; i <= crateCount; i++) {

    var drink = Random.choice([{
      content: "Club-Mate",
      price: 80,
      volume: 20
    }, {
      content: "fritz kola",
      price: 90,
      volume: 24
    }]);

    var crate = {
      content: drink.content,
      volume: drink.volume,
      pricePerBottle: drink.price,
      boughtAt: dateBetween(moment().subtract(1, 'year')._d, moment().subtract(30, 'days')._d),
      roomNo: Random.choice(["1.2.9", "1.2.10"])
    };
    Crates.insert(crate);
  }
  console.log("mocking crates finished");
  if (cb) {
    cb();
  }
};

mockTransactions = function(cratesToEmpty) {
  if (!cratesToEmpty) {
    cratesToEmpty = 5;
  }
  Transactions.remove({});

  _.times(cratesToEmpty, function() {
    var crate = getRandomCrate();
    processCrate(crate);
  });

  function processCrate(crate) {
    var dates = [];
    _.times(crate.volume, function() {
      dates.push(dateBetween(crate.boughtAt, moment(crate.boughtAt).add(rib(14, 17), 'days')._d));
    });
    dates = dates.sort(function(a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return b - a;
    });
    _.times(crate.volume, function() {
      buyBottleMock(
        crate._id,
        Random.choice(Meteor.users.find({
          "profile.balance": {
            $gte: crate.pricePerBottle
          }
        }).fetch()).username,
        dates.pop()
      );
    });
  }
  console.log("mocking transactions finished");
};

mockNews = function(newsCount) {
  if (!newsCount) {
    newsCount = 5;
  }

  News.remove({});
  var date = moment();
  _(newsCount).times(function() {
    News.insert({
      // Take 2 to 4 words
      headline: Fake.sentence(1).split(" ").slice(0, rib(2, 4)).join(" "),
      locale: Random.choice(["de", "en"]),
      //go between 0 and 14 days back
      date: date.subtract(Random.fraction() * 14, 'days')._d,

      // make 1 to 4 paragraphs
      text: Fake.paragraph(rib(1, 4), {
        format: 'text'
      })
    });
  });
  console.log("mocking news finished");
};

buyBottleMock = function(crateId, username, date) {
  check(crateId, String);

  var crate = Crates.findOne({
    _id: crateId
  });

  var user = Meteor.users.findOne({
    username: username
  });

  if (user.profile.balance >= crate.pricePerBottle && crate.volume >= 1) {
    Meteor.users.update({
      username: username
    }, {
      $set: {
        'profile.balance': user.profile.balance - crate.pricePerBottle,
        'profile.lastBought': {
          when: date
        }
      }
    });

    var crateUpdateObject = {
      $inc: {
        volume: -1
      }
    };
    if (crate.volume <= 1) {
      crateUpdateObject.$set = {
        depletedAt: moment(date)._d
      };
    }

    Crates.update({
      _id: crateId
    }, crateUpdateObject);

    crate = Crates.findOne({
      _id: crateId
    });

    Transactions.insert({
      userName: username,
      userId: Meteor.users.findOne({
        username: username
      })._id,
      crate: crate,
      value: crate.pricePerBottle,
      boughtAt: moment(date)._d
    });
  }
};
