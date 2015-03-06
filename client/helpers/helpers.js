var getData = function (thisArg) {
  return thisArg === window ? {} : thisArg;
};

processPathArgs = function (routeName, options) {
  if (_.isObject(routeName)) {
    options = routeName;
    routeName = options.route;
  }

  var opts = options.hash || {};
  var params = opts.params || _.omit(opts, 'hash', 'query');
  var hash = opts.hash;
  var query = opts.query;

  // if called without opts, use the data context of the parent
  if (_.isEmpty(opts)) {
    params = getData(this);
  }

  return {
    routeName: routeName,
    params: params,
    query: query,
    hash: hash
  };
};
