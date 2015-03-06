Meteor.publish("pages", function(options) {
  if (Roles.userIsInRole(this.userId, ['pages:read'])) {
    return Pages.find({});
  } else if (this.userId) {
    return Pages.find({
      $or: [{
        name: "termsAndConditions"
      }, {
        deleted: {
          $exists: false
        },
        locale: options.locale,
        name: options.name
      }]
    });
  } else {
    return this.ready();
  }
});

Meteor.publish("pageSingle", function(pageId) {
  if (Roles.userIsInRole(this.userId, ['pages:read'])) {
    return Pages.find({_id:pageId});
  } else {
    return this.ready();
  }
});
