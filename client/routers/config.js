function navigatorLanguage() {
  var results = /(\w{2}).*/gi.exec(window.navigator.language);
  return results.length > 1 && results[1];
}

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'not_found',
  onBeforeAction: function() {
    Session.set("maxSize", 7);
    Session.set("documentsPerPage", 10);

    var language = this.params.language || navigatorLanguage();
    if (language && Meteor.getLocale() !== language) {
      Meteor.setLocale(language);
    }
  }
});