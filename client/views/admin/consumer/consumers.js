Router.map(function() {
  this.route('admin_consumers', {
    path: "/:language?/admin/consumers",
    waitOn: function() {
      return Meteor.subscribe("users");
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['users:read'])) {
        this.redirect('/');
      }
    },
    data: function() {
      if (this.ready()) {
        var consumers = Meteor.users.find({}, {
          sort: {
            'username': 1
          },
          skip: (this.params.page - 1) * Session.get("documentsPerPage"),
          limit: Session.get("documentsPerPage")
        });

        var allConsumers = Meteor.users.find({}, {
          sort: {
            'username': 1
          }
        });

        var pages = getPages(this.params.page, Meteor.users.find().count(), Session.get("documentsPerPage"), Session.get("maxSize"));

        return {
          consumers: consumers,
          allConsumers: allConsumers,
          pages: pages
        }
      }
    }
  });
});

Template.admin_consumers.rendered = function() {
  var users = Meteor.users.find({}, {
    sort: {
      'username': 1
    }
  }).fetch();

  var options = {
    onChange: function(value) {
      if (!value.length) return;
      Router.go("admin_consumer", {
        _id: value,
        language: Meteor.getLocale()
      });
    },
    maxItems: null
  };
  $('#usernames').selectize(options);
};