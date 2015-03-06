formatCurrency = function(number) {
  number = number || 0;
  number /= 100;
  return numeral(number).format('0.00 $');
};

dateFormat = function(context, block) {
  moment.locale(Session.get('locale'));
  if (typeof context === 'undefined' || context === null || context === '') {
    return "";
  } else if (window.moment) {
    var f = block && block.hash && block.hash.format ? block.hash.format : "Do MMMM YYYY HH:mm";
    return moment(context).format(f);
  } else {
    return context;
  }
};

UI.registerHelper('dateFormat', function(context, block) {
  return dateFormat(context, block);
});

UI.registerHelper('formatBoolean', function(context) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return "✗";
  } else {
    return "✔";
  }
});

UI.registerHelper('formatNegativeBoolean', function(context) {
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

UI.registerHelper('boolToChecked', function(context) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return false;
  } else {
    return 'checked';
  }
});

UI.registerHelper('booleanTextClass', function(context) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return "text-danger";
  } else {
    return "text-success";
  }
});

UI.registerHelper('negativeBooleanTextClass', function(context) {
  if (typeof context === 'undefined' || context === null || context === false) {
    return "text-success";
  } else {
    return "text-danger";
  }
});

UI.registerHelper('formatCurrency', function(number) {
  return formatCurrency(number);
});

UI.registerHelper('termsAndConditionsAccepted', function() {
  return !!Meteor.user().profile.termsAndConditionsAccepted;
});

var isNavActive = function(page, matchTop) {
  var isActive = false;
  if (!Router || !Router.current() || Router.current().path.split('/')[1] === undefined) {
    return false;
  }

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
    roles;

  if (!user) {
    return false;
  }
  if (!Match.test(role, String)) {
    return false;
  }

  if (comma !== -1) {
    roles = _.reduce(role.split(','), function(memo, r) {
      if (!r || !r.trim()) {
        return memo;
      }
      memo.push(r.trim());
      return memo;
    }, []);
  } else {
    roles = [role];
  }

  if (Match.test(group, String)) {
    return !Roles.userIsInRole(user, roles, group);
  }
  return !Roles.userIsInRole(user, roles);
});

UI.registerHelper('hasElements', function(cursor) {
  var hasElements = false;
  if (!_.isArray(cursor)) {
    hasElements = !!(cursor.count());
  } else {
    hasElements = cursor.length >= 0;
  }
  if (Object.prototype.toString.call(cursor) === '[object Array]') {
    hasElements = cursor.length > 0;
  }

  return hasElements;
});

UI.registerHelper("pathFor", function(routeName, options) {
  var args = processPathArgs.call(this, routeName, options);

  args.params = _.extend(args.params, {
    language: Session.get('locale')
  });

  return Router.path(args.routeName, args.params, {
    query: args.query,
    hash: args.hash
  });
});


UI.registerHelper('i18n', function(key, options) {
  return TAPi18n.__(key, options);
});

UI.registerHelper('t', function(key, options) {
  return TAPi18n.__(key, options || {});
});
