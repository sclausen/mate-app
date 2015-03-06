Template.admin_transactions.pluralBottle = function(volume) {
  return volume > 1 ? __("bottle") : volume === 0 ? __("bottle") : __("bottle");
};


Template.admin_transactions.helpers({
  moreResults: function() {
    var ctrl = Iron.controller();
    return ctrl.state.get('limit') < ctrl.count();
  }
});

Template.admin_transactions.events({
  'click #showMoreResults': function(e) {
    e.preventDefault();
    var ctrl = Iron.controller();
    ctrl.state.set('limit', ctrl.state.get('limit') + ctrl.increment);
  }
});
