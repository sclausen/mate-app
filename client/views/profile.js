Template.profile.helpers({
  consumer: function() {
    var user = Meteor.user();
    if (user === undefined) {
      return null;
    }
    return user;
  },
  userName: function() {
    return this.username ? this.username : this.profile.name;
  }
});
