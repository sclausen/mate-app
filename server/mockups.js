function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomCrate() {
  return Random.choice(Crates.find({
    depleted: null
  }, {
    sort: {
      bought: 1
    }
  }).fetch());
}

mockPages = function() {
  var pages = [{
    "title": "Wie funktioniert das Ganze?",
    "locale": "de",
    "name": "help",
    "text": "Nach der Registrierung gehst Du zu einem Administrator der App und zahlst einen beliebigen Betrag bei ihm ein. Wenn Du nun zm Beispiel eine Flasche „Club-Mate” trinken möchtest, klickst Du **zuerst** auf „Kaufen” und gehst **nachfolgend** zu der Kiste und holst Dir Deine Flasche."
  }, {
    "name": "help",
    "title": "How does stuff work?",
    "locale": "en",
    "text": "After your registration you should visit the administrator and deposit any amount of money. If you want to consume a beverage, you have to **first** click on the buy button and **then** you can take the beverage out of the crate."
  }, {
    "title": "Impressum",
    "locale": "de",
    "name": "impressum",
    "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. \n\nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit.\n\nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
  }, {
    "title": "Imprint",
    "locale": "en",
    "name": "impressum",
    "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. \n\nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit.\n\nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
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
}

mockRoles = function(adminUsers) {
  var roles = {
    users: ["read", "update"],
    pages: ["read", "create", "update", "delete"],
    news: ["read", "create", "update", "delete"],
    crates: ["create", "read", "update"],
    transactions: ["read"],
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

  console.log("roles mocked");
}

mockTranslations = function() {
  var translations = {
    "admin": {
      "de": "Admin",
      "en": "Admin"
    },
    "back": {
      "de": "Zurück",
      "en": "Back"
    },
    "balance": {
      "de": "Kontostand",
      "en": "Balance"
    },
    "insufficient_funds": {
      "de": "Du hast nicht mehr genug Guthaben um eine Flasche zu kaufen!",
      "en": "Your funds are insufficient to buy this beverage!"
    },
    "bank": {
      "de": "Kasse",
      "en": "Bank"
    },
    "book": {
      "de": "Buchen",
      "en": "Book"
    },
    "booking": {
      "de": "Buchung",
      "en": "Booking"
    },
    "bottle": {
      "de": "Flasche",
      "en": "bottle"
    },
    "bottles": {
      "de": "Flaschen",
      "en": "bottles"
    },
    "bought": {
      "de": "Gekauft",
      "en": "Bought"
    },
    "buy": {
      "de": "Kaufen",
      "en": "Buy"
    },
    "consumer": {
      "de": "Konsument",
      "en": "Consumer"
    },
    "consumers": {
      "de": "Konsumenten",
      "en": "Consumers"
    },
    "consumption": {
      "de": "Konsum",
      "en": "Consumption"
    },
    "content": {
      "de": "Inhalt",
      "en": "Content"
    },
    "crate_saved": {
      "de": "Die Kiste wurde gespeichert!",
      "en": "The crate has been saved!"
    },
    "crates": {
      "de": "Kisten",
      "en": "Crates"
    },
    "crates_depleted_header": {
      "de": "Getränke sind aus!",
      "en": "Beverages are out of stock!"
    },
    "crates_depleted_text": {
      "de": "Es wird schleunigst für Nachschub gesorgt!",
      "en": "Supply is on ordered!"
    },
    "email": {
      "de": "E-Mail",
      "en": "E-Mail"
    },
    "password": {
      "de": "Passwort",
      "en": "Password"
    },
    "date": {
      "de": "Datum",
      "en": "Date"
    },
    "de": {
      "de": "Deutsch",
      "en": "German"
    },
    "depleted": {
      "de": "Aufgebraucht",
      "en": "Depleted"
    },
    "deposit": {
      "de": "Einzahlung",
      "en": "Deposit"
    },
    "deposited": {
      "de": "eigezahlt!",
      "en": "deposited!"
    },
    "disbursal": {
      "de": "Auszahlung",
      "en": "Disbursal"
    },
    "disbursed": {
      "de": "ausgezahlt!",
      "en": "disbursed"
    },
    "donations": {
      "de": "Spenden",
      "en": "Donations"
    },
    "en": {
      "de": "Englisch",
      "en": "English"
    },
    "error": {
      "de": "Fehler",
      "en": "Error"
    },
    "for": {
      "de": "für",
      "en": "for"
    },
    "headline": {
      "de": "Überschrift",
      "en": "Headline"
    },
    "help": {
      "de": "Hilfe",
      "en": "Help"
    },
    "help_header": {
      "de": "Wie funktioniert das Ganze?",
      "en": "How does stuff work?"
    },
    "help_text": {
      "de": "Nach der Registrierung gehst Du zu einem Administrator der App und zahlst einen beliebigen Betrag bei ihm ein. Wenn Du nun zm Beispiel eine Flasche „Club-Mate” trinken möchtest, klickst Du zuerst auf „Kaufen” und gehst nachfolgend zu der Kiste und holst Dir Deine Flasche.",
      "en": "After your registration you should visit the administrator and deposit any amount of money. If you want to consume a beverage, you have to first klick on the buy button and then you can take the beverage out of the crate."
    },
    "history": {
      "de": "Verlauf",
      "en": "History"
    },
    "imprint": {
      "de": "Impressum",
      "en": "Imprint"
    },
    "info": {
      "de": "Info",
      "en": "Info"
    },
    "joined": {
      "de": "Beigetreten",
      "en": "Joined"
    },
    "jump_to": {
      "de": "Schnellsprung",
      "en": "Jump to"
    },
    "languages": {
      "de": "Sprachen",
      "en": "Languages"
    },
    "last_purchase": {
      "de": "Zuletzt gekauft",
      "en": "Last purchase"
    },
    "last_seen": {
      "de": "Zuletzt gesehen",
      "en": "Last seen"
    },
    "last_visited": {
      "de": "Zuletzt gesehen",
      "en": "Last visited"
    },
    "login": {
      "de": "Anmelden",
      "en": "Login"
    },
    "logout": {
      "de": "Abmelden",
      "en": "Logout"
    },
    "my_data": {
      "de": "Meine Daten",
      "en": "My Data"
    },
    "name": {
      "de": "Name",
      "en": "Name"
    },
    "new_crate": {
      "de": "Neue Kiste",
      "en": "New Crate"
    },
    "new_news": {
      "de": "Neue News",
      "en": "New News"
    },
    "new_page": {
      "de": "Neue Seite",
      "en": "New Page"
    },
    "news": {
      "de": "News",
      "en": "News"
    },
    "no_transactions_header": {
      "de": "Du hast noch nichts gekauft!",
      "en": "You didn't bought anything!"
    },
    "no_transactions_text": {
      "de": "Sobald Du als Konsument aktiv geworden bist, kannst Du hier alle Transaktionen wie Einzahlungen und Käufe sehen.",
      "en": "As soon as you got active as a consumer ,you will see purchases and other transactions."
    },
    "not_depleted": {
      "de": "Noch nicht aufgebraucht",
      "en": "Not depleted"
    },
    "not_found_header": {
      "de": "Sorry, die seite gibts nicht!",
      "en": "Sorry, this page doesn't exist!"
    },
    "not_found_text": {
      "de": "Geh zurück, es gibt hier nichts zu sehen!",
      "en": "Go back, nothing to see here!"
    },
    "accept_terms_and_conditions": {
      "de": "AGB akzeptieren",
      "en": "Accept Terms and Conditions"
    },
    "of": {
      "de": "von",
      "en": "of"
    },
    "or": {
      "de": "oder",
      "en": "or"
    },
    "access_denied": {
      "de": "Zugriff verweigert!",
      "en": "Access Denied!"
    },
    "login_with_github": {
      "de": "Login mit Github",
      "en": "Login with Github"
    },
    "other_booking": {
      "de": "Sonstige Buchung",
      "en": "Other Booking"
    },
    "page_saved": {
      "de": "Die Seite wurde gespeichert!",
      "en": "The page has been saved!"
    },
    "locale": {
      "de": "Sprache",
      "en": "Locale"
    },
    "pages": {
      "de": "Seiten",
      "en": "Pages"
    },
    "please_login": {
      "de": "Bitte anmelden",
      "en": "Please Login"
    },
    "price": {
      "de": "Preis",
      "en": "Price"
    },
    "profile": {
      "de": "Profil",
      "en": "Profile"
    },
    "profile_saved": {
      "de": "Das Profil ist gespeichert worden",
      "en": "The profile has been saved!"
    },
    "rights": {
      "de": "Rechte",
      "en": "Permissions"
    },
    "room": {
      "de": "Raum",
      "en": "Room"
    },
    "roomNo": {
      "de": "Raumnummer",
      "en": "Room No."
    },
    "save": {
      "de": "Speichern",
      "en": "Save"
    },
    "statistics": {
      "de": "Statistik",
      "en": "Statistics"
    },
    "stock": {
      "de": "Verfügbar",
      "en": "Stock"
    },
    "subject": {
      "de": "Betreff",
      "en": "Subject"
    },
    "success": {
      "de": "Erfolg",
      "en": "Success"
    },

    "Match failed": {
      "de": "Match failed",
      "en": "Match failed"
    },
    "terms_and_conditions_accepted": {
      "de": "AGB akzeptiert",
      "en": "Terms and Conditions accepted"
    },
    "toggle-navigation": {
      "de": "Navigation umschalten",
      "en": "Toggle Navigation"
    },
    "transaction_bottle_bought": {
      "de": "{{volume}} Flasche(n) {{content}} in {{roomNo}} übrig. Kiste gekauft am {{bought}} für {{pricePerBottle}} / Flasche",
      "en": "{{volume}} bottle(s) {{content}} in {{roomNo}} remaining. Crate bought at {{bought}} for {{pricePerBottle}} / bottle"
    },
    "transactions": {
      "de": "Transaktionen",
      "en": "Transactions"
    },
    "unread_news": {
      "de": "Ungelesene News",
      "en": "Unread News"
    },
    "unread_news_flashing": {
      "de": "Ungelesene News Meldung",
      "en": "Unread News Flashing"
    },
    "without_deposit": {
      "de": "Ohne Pfand",
      "en": "Without beverage deposit"
    },
    "youve": {
      "de": "Du hast",
      "en": "You have"
    },
    "youve_booked": {
      "de": "Du hast {{amount}} gebucht!",
      "en": "You've booked {{amount}}"
    },
    "youve_deposited": {
      "de": "Du hast {{amount}} eingezahlt!",
      "en": "You've deposited {{amount}}!"
    },
    "youve_disbursed": {
      "de": "Du hast {{amount}} ausgezahlt!",
      "en": "You've disbursed {{amount}}"
    },
    "admin_consumer_negative_balance_forbidden": {
      "de": "Ein Konsument kann nicht ins Minus gehen!",
      "en": "It's not allowed to set a negative users balance!"
    }
  };

  Translations.remove({});

  _.each(translations, function(translation, key) {
    Translations.insert(_.extend({
      key: key
    }, translation));
  });
  console.log("mocking translations finished");
}

mockUsers = function(userCount, callback) {
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
  callback();
}

mockCrates = function(crateCount, callback) {
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
      bought: randomDate(moment().subtract('years', 1)._d, moment().subtract('days', 30)._d),
      roomNo: Random.choice(["1.2.9", "1.2.10"])
    }
    Crates.insert(crate);
  }
  console.log("mocking crates finished");
  callback()
}

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
      dates.push(randomDate(crate.bought, moment(crate.bought).add('days', rib(14, 17))._d))
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
}

mockNews = function(newsCount) {
  if (!newsCount) {
    newsCount = 5;
  }

  News.remove({});
  var date = moment();
  _(newsCount).times(function(n) {
    News.insert({
      // Take 2 to 4 words
      headline: dimsum.sentence(1).split(" ").slice(0, rib(2, 4)).join(" "),
      locale: Random.choice(["de", "en"]),
      //go between 0 and 14 days back
      date: date.subtract('days', Random.fraction() * 14)._d,

      // make 1 to 4 paragraphs
      text: dimsum(rib(1, 4), {
        format: 'text'
      })
    });
  });
  console.log("mocking news finished");
}

buyBottleMock = function(crateId, username, date) {
  check(crateId, String);
  var self = this;

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
    if (crate.volume == 1) {
      crateUpdateObject.$set = {
        depleted: moment(date)._d
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
      value: -crate.pricePerBottle,
      bought: moment(date)._d
    });
  }
}