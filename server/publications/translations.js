Meteor.publish("translations", function() {
  var translations = Translations.find();
  return translations;
});