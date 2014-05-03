var ITEMS_INCREMENT = 20;
Router.map(function() {
  this.route('transactions', {
    path: '/:language?/transactions',
    onRun: function() {
      Session.set('itemsLimit', ITEMS_INCREMENT);
    },
    waitOn: function() {
      return [Meteor.subscribe("users"), Meteor.subscribe("transactions")]
    },
    action: function() {
      if (this.ready()) {
        this.render();
      }
    },
    data: function() {
      if (this.ready()) {
        var transactions = Transactions.find({
          userId: Meteor.userId()
        }, {
          sort: {
            bought: -1
          },
          // skip: (this.params.page - 1) * (Session.get("documentsPerPage") || 10),
          limit: Session.get('itemsLimit')
        });

        var pages = getPages(this.params.page, Transactions.find({
          userId: Meteor.userId()
        }).count(), Session.get("documentsPerPage"), Session.get("maxSize"));

        return {
          transactions: transactions,
          pages: pages
        }
      }
    }
  });
});

Template.transactions.pluralBottle = function(volume) {
  return volume > 1 ? __("bottle") : volume == 0 ? __("bottle") : __("bottle");
}

// whenever #showMoreResults becomes visible, retrieve more results
function showMoreVisible() {
  var threshold, target = $('#showMoreResults');
  if (!target.length) return;

  threshold = $(window).scrollTop() + $(window).height() - target.height() + 100;

  if (target.offset().top < threshold) {
    if (!target.data('visible')) {
      // console.log('target became visible (inside viewable area)');
      target.data('visible', true);
      Session.set('itemsLimit',
        Session.get('itemsLimit') + ITEMS_INCREMENT);
    }
  } else {
    if (target.data('visible')) {
      // console.log('target became invisible (below viewable arae)');
      target.data('visible', false);
    }
  }
}

Template.transactions.rendered = function() {
  showMoreVisible();
  $(window).scroll(showMoreVisible);
}


Template.transactions.moreResults = function() {
  // If, once the subscription is ready, we have less rows than we
  // asked for, we've got all the rows in the collection.
  return !(Transactions.find().fetch().length < Session.get('itemsLimit'));
}