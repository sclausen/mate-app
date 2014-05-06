function navigatorLanguage() {
  var results = /(\w{2}).*/gi.exec(window.navigator.language);
  return results.length > 1 && results[1];
}

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'not_found',
  waitOn: function() {
    return Meteor.subscribe("translations");
  },
  onBeforeAction: function() {
    Session.set("maxSize", 7);
    Session.set("documentsPerPage", 10);

    var language = this.params.language || navigatorLanguage();
    if (language && Meteor.getLocale() !== language) {
      Meteor.setLocale(language);
    }

    if (this.ready()) {
      translations = {};
      Translations.find().map(function(tx) {
        translations[tx.key] = {};
        _.each(_.omit(Object.keys(tx), "_id", "key"), function(key) {
          translations[tx.key][key] = tx[key];
        });
      });
      Meteor.i18nMessages = translations;
    }
  }
});