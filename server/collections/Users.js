Meteor.users.allow({
  update: function(userId) {
    return !!userId;
  }
});

Meteor.users.deny({
  insert: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    var user = Meteor.users.findOne(userId);

    //normal users can accept the terms and conditions
    var isAcceptTAC = modifier.$set && _.isBoolean(modifier.$set['profile.termsAndConditionsAccepted']);
    //normal users can set unreadNews to false;
    var isReadNews = modifier.$set && _.isBoolean(modifier.$set['profile.unreadNews']);

    var hasRights = !!Roles.userIsInRole(user, ['users:update']);

    // is registered user and either just wants to accept the termas and conditions or has the right to update users
    var forbidden = !(userId && (isReadNews || isAcceptTAC || hasRights));

    if (forbidden && userId) {
      FlashMessages.sendError({
        text: 'access_denied',
        userId: userId
      });
    }

    return forbidden;
  }
});
