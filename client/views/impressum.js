Router.map(function() {
  this.route('impressum', {
    path: "/:language?/impressum",
    waitOn: function() {
      return Meteor.subscribe("pages", {
        name: "impressum",
        locale: Meteor.getLocale()
      })
    },
    action: function() {
      if (this.ready()) {
        this.render();
      }
    },
    data: function() {
      if (this.ready()) {
        return Pages.findOne({
          name: "impressum",
          locale: Meteor.getLocale()
        })
      }
    }
  });
});