Template.userSelector.rendered = function() {
  var options = {
    create: false,
    persist: false,
    onChange: function(value) {
      if (!value.length) {
        return;
      }
      Router.go("admin_consumer", {
        _id: value,
        language: Session.get('locale')
      });
    },
    valueField: "_id",
    labelField: "username",
    sortField: "username",
    searchField: "username",
    maxOptions: null,
    options: _.map(Meteor.users.find().fetch(), function(user) {
      if (user.profile && user.profile.name) {
        user.username = user.profile.name;
      }
      return user;
    })
  };
  $('#usernames').selectize(options);
};
