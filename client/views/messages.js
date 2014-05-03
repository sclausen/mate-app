flashMessages = new Meteor.Collection(null);

FlashMessages = {
  sendAlert: function(message, options) {
    sendMessage(message, '', options);
  },
  sendError: function(message, options) {
    sendMessage("<strong><i class=\"fa fa-warning\"></i> " + __("error") + ":</strong> " + message,
      'alert-error alert-danger', options);
  },
  sendSuccess: function(message, options) {
    sendMessage("<strong><i class=\"fa fa-heart\"></i> " + __("success") + ":</strong> " + message, 'alert-success',
      options);
  },
  sendInfo: function(message, options) {
    sendMessage("<strong><i class=\"fa fa-info-circle\"></i> " + __("info") + ":</strong> " + message, 'alert-info',
      options);
  },
  clear: function() {
    flashMessages.remove({
      seen: true
    });
  },
  configure: function(options) {
    this.options = this.options || {};
    _.extend(this.options, options);
  },
  options: {
    autoHide: true,
    hideDelay: 3000
  }
}

sendMessage = function(message, style, options) {
  options = options || {};
  options.autoHide = options.autoHide === undefined ? FlashMessages.options.autoHide : options.autoHide;
  options.hideDelay = options.hideDelay || FlashMessages.options.hideDelay;
  flashMessages.insert({
    message: message,
    style: style,
    seen: false,
    options: options
  });
}