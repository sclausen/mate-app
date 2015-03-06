Template.navigation.events({
  'click .logout': function(event) {
    Meteor.logout();
    event.preventDefault();
  }
});

Template.navigation.helpers({
  activeLanguageClass: function(language) {
    if (language === Session.get('locale')) {
      return 'active';
    } else {
      return undefined;
    }
  },
  currentLanguage: function() {
    return Session.get('locale');
  },
  userName: function() {
    return Meteor.user().username ? Meteor.user().username : Meteor.user().profile.name;
  }
});

Template.navigation.events({
  'click .changeLocale': function(event) {
    var locale = $(event.currentTarget).attr("locale");
    changeLocale(locale);
    event.preventDefault();
  }
});
