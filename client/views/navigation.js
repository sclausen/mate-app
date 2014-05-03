Template.navigation.events({
  'click .logout': function(event) {
    Meteor.logout();
    event.preventDefault();
  }
});

Template.navigation.helpers({
  activeLanguageClass: function(language) {
    if (language === Meteor.getLocale()) {
      return 'active';
    } else {
      return undefined;
    }
  },
  currentLanguage: function() {
    return Meteor.getLocale();
  }
});