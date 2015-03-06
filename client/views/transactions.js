Template.transactions.helpers({
  pluralBottle: function (volume) {
    return volume > 1 ? TAPi18n.__("bottle") : volume === 0 ? TAPi18n.__("bottle") : TAPi18n.__("bottle");
  }
});

Template.transactions.helpers({
  moreResults: function() {
    var ctrl = Iron.controller();
    return ctrl.state.get('limit') < ctrl.count();
  }
});

Template.transactions.events({
  'click #showMoreResults': function(e) {
    e.preventDefault();
    var ctrl = Iron.controller();
    ctrl.state.set('limit', ctrl.state.get('limit') + ctrl.increment);
  }
});
