Template.pagination.pages = function() {
  if (this instanceof Array) {
    return this
  } else {
    return [];
  }
}