Meteor.publish("translations", function() {
  return Translations.find();
});