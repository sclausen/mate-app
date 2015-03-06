InfiniteScrollingController = RouteController.extend({
  onBeforeAction: function () {
    this.state.setDefault('limit', this.increment * 2);
    this.next();
  },
  limit: function () {
    return this.state.get('limit') || this.increment;
  },
  onAfterAction: function () {
    $(window).scroll(this.showMoreVisible);
  },
  showMoreVisible: function () {
    var ctrl = Router.current();
    var threshold, target = $('#showMoreResults');
    if (target.length) {
      threshold = $(window).scrollTop() + $(window).height() - target.height();
      if (target.offset().top <= threshold) {
        if (!target.data('visible')) {
          target.data('visible', true);
          ctrl.state.set('limit', ctrl.state.get('limit') + ctrl.increment);
        }
      } else {
        if (target.data('visible')) {
          target.data('visible', false);
        }
      }
    }
  }
});
