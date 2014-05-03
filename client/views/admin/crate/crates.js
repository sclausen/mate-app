Router.map(function() {
  this.route('admin_crates', {
    path: '/:language?/admin/crates',
    waitOn: function() {
      return Meteor.subscribe("crates");
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['crates:read'])) {
        this.redirect('/');
      }
    },
    data: function() {
      var crates = Crates.find({}, {
        sort: {
          volume: -1,
          depleted: -1
        },
        skip: (this.params.page - 1) * Session.get("documentsPerPage"),
        limit: Session.get("documentsPerPage")
      });

      var pages = getPages(this.params.page, Crates.find({}).count(), Session.get("documentsPerPage"), Session.get("maxSize"));


      return {
        crates: crates,
        pages: pages
      }
    }
  });
});