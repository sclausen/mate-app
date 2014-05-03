Deps.autorun(function() {
  var sub;
  sub = Meteor.subscribe("translations");
  if (sub.ready()) {
    translations = {};
    Translations.find().map(function(tx) {
      translations[tx.key] = {};
      _.each(_.omit(Object.keys(tx), "_id", "key"), function(key) {
        translations[tx.key][key] = tx[key];
      });
    });
    Meteor.i18nMessages = translations;
  }
});

Meteor.startup(function() {
  Session.set("currentPage", 1);
  Session.set("documentsPerPage", 10);
  Session.set("maxSize", 7);
  numeral.language("de");
});