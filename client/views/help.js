Router.map(function() {
  this.route('help', {
    path: "/:language?/help",
    waitOn: function() {
      return Meteor.subscribe("pages", {
        name: "help",
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
          name: "help",
          locale: Meteor.getLocale()
        })
      }
    }
  });
});