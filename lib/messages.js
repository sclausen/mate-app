FlashMessages = {
  // Deprecated, use sendWarning instead. sendWarning is more consistent with Boostrap classes.
  sendAlert: function(options, cb) {
    sendMessage(options, cb);
    console.log('Deprecated, use sendWarning instead of sendAlert');
  },
  sendWarning: function(options, cb) {
    options = _.extend(options || {}, {
      style: 'alert-warning'
    });
    sendMessage(options, cb);
  },
  sendError: function(options, cb) {
    options = _.extend(options || {}, {
      style: 'alert-error alert-danger'
    });
    sendMessage(options, cb);
  },
  sendSuccess: function(options, cb) {
    options = _.extend(options || {}, {
      style: 'alert-success'
    });
    sendMessage(options, cb);
  },
  sendInfo: function(options, cb) {
    options = _.extend(options || {}, {
      style: 'alert-info'
    });
    sendMessage(options, cb);
  },
  clear: function() {
    Messages.remove({
      seen: true
    });
  },
  configure: function(options) {
    this.options = this.options || {};
    _.extend(this.options, options);
  },
  options: {
    autoHide: true,
    hideDelay: 5000,
    autoScroll: true
  }
};

if (Meteor.isClient) {
  sendMessage = function(options, cb) {
    options.autoHide = options.autoHide === undefined ? FlashMessages.options.autoHide : options.autoHide;
    options.hideDelay = options.hideDelay || FlashMessages.options.hideDelay;
    options.seen = false;
    options = _.extend(options, {
      userId: Meteor.userId()
    });
    Messages.insert(options, function() {
      if (cb) {
        cb();
      }
    });
  };
} else if (Meteor.isServer) {
  sendMessage = function(options, cb) {
    options.autoHide = options.autoHide === undefined ? FlashMessages.options.autoHide : options.autoHide;
    options.hideDelay = options.hideDelay || FlashMessages.options.hideDelay;
    options.seen = false;
    Messages.insert(options, function() {
      if (cb) {
        cb();
      }
    });
  };
}
