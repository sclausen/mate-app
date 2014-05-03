Meteor.publish(null, function() {
  return Meteor.roles.find({})
});