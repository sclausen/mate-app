Router.map(function() {
  this.route('profile', {
    path: "/:language?/profile"
  });
});

Template.profile.consumer = function() {
  var user = Meteor.user();
  if (user === undefined) return null;
  return user;
}