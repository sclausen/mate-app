var ITEMS_INCREMENT = 20;
Router.map(function() {
  this.route('admin_pages', {
    path: '/:language?/admin/pages',
    onRun: function() {
      Session.set('itemsLimit', ITEMS_INCREMENT);
    },
    waitOn: function() {
      return Meteor.subscribe("pages")
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['pages:read'])) {
        this.redirect('/');
      }
    },
    data: function() {
      var pages = Pages.find({}, {
        skip: (this.params.page - 1) * 3,
        limit: Session.get('itemsLimit')
      });

      return {
        pages: pages
      }
    }
  });
});

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

Template.admin_pages.rendered = function() {
  showMoreVisible();
  $(window).scroll(showMoreVisible);
}


Template.admin_pages.moreResults = function() {
  // If, once the subscription is ready, we have less rows than we
  // asked for, we've got all the rows in the collection.
  return !(Transactions.find().fetch().length < Session.get('itemsLimit'));
}