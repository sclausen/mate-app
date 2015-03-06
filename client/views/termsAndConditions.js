// Meteor.subscribe("pages", );
// 
Meteor.subscribe('pages', {
  name: 'termsAndConditions',
  locale: Session.get('locale')
});

Template.termsAndConditions.events({
  'click .accept': function () {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.termsAndConditionsAccepted': true
      }
    });
  }
});

Template.termsAndConditions.helpers({
  data: function () {
    return Pages.findOne({
      name: 'termsAndConditions',
      locale: Session.get('locale')
    });
  }
});
