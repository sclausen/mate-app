Meteor.publish('messages', function() {
  if (!this.userId) {
    return this.ready();
  }
  
  return Messages.find({
    userId: this.userId
  });
});
