formatCurrency = function(number) {
  number /= 100;
  return numeral(number).format('0.00 $')
}

dateFormat = function(context, block) {
  moment.lang(Meteor.getLocale());
  if (typeof context === 'undefined' || context === null || context == '') {
    return "";
  } else if (window.moment) {
    var f = block && block.hash && block.hash.format ? block.hash.format : "Do MMMM YYYY HH:mm";
    return moment(context).format(f);
  } else {
    return context;
  };
}

UI.registerHelper('dateFormat', function(context, block) {
  return dateFormat(context, block);
});

UI.registerHelper('formatBoolean', function(context, block) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return "✗";
  } else {
    return "✔";
  }
});

UI.registerHelper('formatNegativeBoolean', function(context, block) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return "✔";
  } else {
    return "✗";
  }
});

UI.registerHelper('unreadNews', function() {
  var user = Meteor.user();
  if (
    user && (
      typeof user.profile.unreadNews === 'undefined' ||
      user.profile.unreadNews === null ||
      user.profile.unreadNews === false)
  ) {
    return "";
  } else {
    return "unread-news";
  }
});

UI.registerHelper('isDev', function() {
  if (window.location.hostname == 'localhost') {
    return true;
  }
  return false;
});

UI.registerHelper('boolToChecked', function(context, block) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return false;
  } else {
    return 'checked';
  }
});

UI.registerHelper('booleanTextClass', function(context, block) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return "text-danger";
  } else {
    return "text-success";
  }
});

UI.registerHelper('negativeBooleanTextClass', function(context, block) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return "text-success";
  } else {
    return "text-danger";
  }
});

UI.registerHelper('formatCurrency', function(number) {
  return formatCurrency(number);
});

UI.registerHelper('calculateBottleCount', function(context, block) {
  return Math.floor(context / 0.7);
});

UI.registerHelper('buyButtonClass', function(context, block) {
  if (typeof context === 'undefined') {
    return 'btn btn-primary btn-block';
  }
  if (
    Session.get("inProgress") == true ||
    (Meteor.user() && parseFloat(parseFloat(Meteor.user().profile.balance).toFixed(2)) < context)
  ) {
    return 'btn btn-primary btn-block disabled';
  } else {
    return 'btn btn-primary btn-block';
  }
});

UI.registerHelper('showAgb', function() {
  return Session.get('showAgb');
});

UI.registerHelper('termsAndConditionsAccepted', function() {
  return !!Meteor.user() && Meteor.user().profile && !! Meteor.user().profile.termsAndConditionsAccepted;
});

var isNavActive = function(page, matchTop) {
  var isActive = false;
  if (!Router || !Router.current() || Router.current().path.split('/')[1] === undefined) return false;

  // If desired check that the top level matches
  if (matchTop) {
    var pathTop = page.split('/')[0];
    var currentPageTop = Router.current().path.split('/')[1];
    if (
      pathTop === currentPageTop ||
      _.contains(pathTop.split('|'), currentPageTop)
    ) {
      isActive = true;
    }
  }

  // Is it a perfect match
  var currentPage = Router.current().path.split('/')[1];
  if (currentPage === page) {
    isActive = true;
  }
  if (Router.current().path === '/' && page === 'news') {
    isActive = true;
  }

  return isActive;
};

UI.registerHelper('isActive', function(page) {
  return isNavActive(page, false) ? 'active' : '';
});

UI.registerHelper('isActiveTop', function(page) {
  return isNavActive(page, true) ? 'active' : '';
});


UI.registerHelper('disabledByRole', function(role, group) {
  var user = Meteor.user(),
    comma = (role || '').indexOf(','),
    roles

  if (!user) return false
  if (!Match.test(role, String)) return false

  if (comma !== -1) {
    roles = _.reduce(role.split(','), function(memo, r) {
      if (!r || !r.trim()) {
        return memo
      }
      memo.push(r.trim())
      return memo
    }, [])
  } else {
    roles = [role]
  }

  if (Match.test(group, String)) {
    return !Roles.userIsInRole(user, roles, group)
  }
  return !Roles.userIsInRole(user, roles)
});

UI.registerHelper('hasElements', function(cursor) {
  if (!cursor) return false;
  return !!(cursor.count());
});

UI.registerHelper("pathFor", function(routeName, options) {
  var args = processPathArgs.call(this, routeName, options);

  args.params = _.extend(args.params, {
    language: Meteor.getLocale()
  });

  return Router.path(args.routeName, args.params, {
    query: args.query,
    hash: args.hash
  });
});

UI.registerHelper('i18n', function(key, options) {
  _.each(Object.keys(options.hash), function(key) {
    var pair = key.split(":");
    if (pair[1]) {
      var result = UI._globalHelper(pair[1])(options.hash[key]);
      key = pair[0];
      options.hash[key] = result;
    }
  });

  var result = __(key, options.hash);

  return result;
});

UI.registerHelper('pathToLanguage', function(language) {
  var ironRouterPackage = 'iron-router';
  var error, parameters, _ref, _ref1;
  if (Package[ironRouterPackage]) {
    try {
      parameters = {
        language: language
      };
      if ((_ref = Package[ironRouterPackage].Router.current()) != null ? _ref.params.section : void 0) {
        parameters.section = Package[ironRouterPackage].Router.current().params.section;
      }
      if ((_ref = Package[ironRouterPackage].Router.current()) != null ? _ref.params._id : void 0) {
        parameters._id = Package[ironRouterPackage].Router.current().params._id;
      }
      return (_ref1 = Package[ironRouterPackage].Router.current()) != null ? _ref1.route.path(parameters) : void 0;
    } catch (_error) {
      console.log(_error);
      return "/" + language;
    }
  } else {
    return Meteor._debug(
      'To benefit from the "pathToLanguage" helper you need to install "iron-router" smart package (https://atmosphere.meteor.com/package/iron-router)'
    );
  }
});