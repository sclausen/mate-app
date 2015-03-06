Template.crates.helpers({
  moreResults: function() {
    var ctrl = Iron.controller();
    return ctrl.state.get('limit') < ctrl.count();
  }
});

Template.crates.events({
  'click #showMoreResults': function(event) {
    event.preventDefault();
    var ctrl = Iron.controller();
    ctrl.state.set('limit', ctrl.state.get('limit') + ctrl.increment);
  }
});
