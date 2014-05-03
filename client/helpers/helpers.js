var getData = function(thisArg) {
  return thisArg === window ? {} : thisArg;
};

processPathArgs = function(routeName, options) {
  if (_.isObject(routeName)) {
    options = routeName;
    routeName = options.route;
  }

  var opts = options.hash || {};
  var params = opts.params || _.omit(opts, 'hash', 'query');
  var hash = opts.hash;
  var query = opts.query;

  // if called without opts, use the data context of the parent
  if (_.isEmpty(opts))
    params = getData(this);

  return {
    routeName: routeName,
    params: params,
    query: query,
    hash: hash
  };
};

function serialize(obj, prefix) {
  var str = [];
  for (var property in obj) {
    var key = prefix ? prefix + "[" + property + "]" : property,
      value = obj[property];
    if (typeof value !== 'undefined') {
      str.push(typeof value == "object" ?
        serialize(value, key) :
        encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  }
  return str.join("&");
}

function buildQuery(_oldParams, newParams) {
  var resultParams = _.extend(_.extend({}, _oldParams), newParams);
  return serialize(resultParams);
}

// Create page object used in template

function makePage(number, text, isActive) {
  var args = processPathArgs.call(this, Router.current().route.name, Router.current().options);
  var params = _.extend(args.params || {}, {
    language: Meteor.getLocale()
  });
  var query = _.extend(args.query || {}, {
    page: number
  });

  var path = Router.path(Router.current().route.name, params, {
    query: query,
    hash: args.hash
  });

  return {
    number: number,
    text: text,
    active: isActive ? 'active' : '',
    path: path
  };
}

getPages = function(currentPage, totalDocuments, documentsPerPage, maxSize) {
  var totalPages = documentsPerPage < 1 ? 1 : Math.ceil(totalDocuments / documentsPerPage);
  totalPages = Math.max(totalPages || 0, 1);
  if (totalPages <= 1) {
    return [];
  }

  // Setup configuration parameters
  var rotate = false;
  currentPage = currentPage ? parseInt(currentPage) : 1;
  // currentPage = parseInt(_currentPage, 10) ? parseInt(_currentPage, 10) : 1;

  var pages = [];

  // Default page limits
  var startPage = 1,
    endPage = totalPages;
  var isMaxSized = (maxSize && maxSize < totalPages);

  // recompute if maxSize
  if (isMaxSized) {
    if (rotate) {
      // Current page is displayed in the middle of the visible ones
      startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
      endPage = startPage + maxSize - 1;

      // Adjust if limit is exceeded
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxSize + 1;
      }
    } else {
      // Visible pages are paginated with maxSize
      startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

      // Adjust last page if limit is exceeded
      endPage = Math.min(startPage + maxSize - 1, totalPages);
    }
  }

  // Add page number links
  for (var number = startPage; number <= endPage; number++) {
    var page = makePage(number, number, number === currentPage);
    pages.push(page);
  }

  // Add links to move between page sets
  if (isMaxSized && !rotate) {
    if (startPage > 1) {
      var previousPageSet = makePage(startPage - 1, '&hellip;', false);
      pages.unshift(previousPageSet);
    }

    if (endPage < totalPages) {
      var nextPageSet = makePage(endPage + 1, '&hellip;', false);
      pages.push(nextPageSet);
    }
  }

  if (currentPage > maxSize) {
    var firstPage = makePage(1, 1, false);
    pages.unshift(firstPage);
  }

  if (currentPage <= totalPages - (totalPages % maxSize) && totalPages > maxSize) {
    var lastPage = makePage(totalPages, totalPages, currentPage === totalPages);
    pages.push(lastPage);
  }

  var previousPage = makePage(currentPage - 1 > 1 ? currentPage - 1 : 1, "&laquo;", false);
  pages.unshift(previousPage);

  var nextPage = makePage(currentPage + 1 < totalPages ? currentPage + 1 : totalPages, "&raquo;", false);
  pages.push(nextPage);

  return pages;
}

replacePlaceholders = (function() {
  var replacer = function(words) {
    return function(value, key) {
      return words[key];
    };
  };

  return function(string, words) {
    return string.replace(/\{{(\w+)\}}/g, replacer(words));
  };
})();