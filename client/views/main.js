// Emitter = new EventEmitter();

Meteor.startup(function() {
  Session.set("isLoggedIn", false);
  Session.set("currentPage", 1);
  Session.set("documentsPerPage", 10);
  Session.set("maxSize", 7);
  Session.set("fullscreen", "off");

  numeral.language("de");

  Config = {
    documentsPerPage: 10
  };
});

Meteor.loginWithOpenID = function(path, op_endpoint, callback) {
  Accounts.callLoginMethod({
    methodArguments: [{
      path: path,
      op_endpoint: op_endpoint
    }],
    userCallback: callback
  });
};

getUserLanguage = function() {
  var results = /(\w{2}).*/gi.exec(window.navigator.language);
  return results.length > 1 && results[1];
};

changeLocale = function(locale) {
  Session.set("translationsLoaded", false);
  Session.set("locale", locale);

  // Emitter.emit('changeLocale');

  T9n.setLanguage(locale);
  moment.locale(locale);
  TAPi18n.setLanguage(locale)
    .done(function() {
      Session.set("translationsLoaded", true);
    })
    .fail(function(error_message) {
      FlashMessages.sendError({
        text: "Error loading Translations" + error_message
      });
    });
};

Meteor.startup(function() {
  changeLocale(getUserLanguage());
  Meteor.subscribe('messages');
});

Meteor.startup(function() {
  T9n.map('de', {
    'password': 'Passwort',
    'passwordAgain': 'Passwort (Wiederholen)',
    'error': {
      'accounts': {
        'Login forbidden': 'Anmeldung verboten',
        'Must be logged in': 'Sie müssen sich anmelden'
      }
    }
  });
});
