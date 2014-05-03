Router.map(function() {
  this.route('admin_transactions', {
    path: '/:language?/admin/transactions',
    waitOn: function() {
      return [Meteor.subscribe("users"), Meteor.subscribe("transactions")]
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['transactions:read'])) {
        this.redirect('/');
      }
    },
    data: function() {
      if (this.ready()) {
        var transactions = Transactions.find({}, {
          sort: {
            bought: -1
          },
          skip: (this.params.page - 1) * (Session.get("documentsPerPage") || 10),
          limit: (Session.get("documentsPerPage") || 10)
        });
        var pages = getPages(this.params.page, Transactions.find({}).count(), Session.get(
            "documentsPerPage"),
          Session.get("maxSize"));

        return {
          transactions: transactions,
          pages: pages
        }
      }
    }
  });
});


Template.admin_transactions.pluralBottle = function(volume) {
  return volume > 1 ? __("bottle") : volume == 0 ? __("bottle") : __("bottle");
}