Template.news.helpers({
  moreResults: function() {
    var ctrl = Iron.controller();
    return ctrl.state.get('limit') < ctrl.count();
  }
});

Template.news.events({
  'click #showMoreResults': function(e) {
    e.preventDefault();
    var ctrl = Iron.controller();
    ctrl.state.set('limit', ctrl.state.get('limit') + ctrl.increment);
  }
});
