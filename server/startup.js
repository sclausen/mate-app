Meteor.startup(function() {
  Future = Npm.require('fibers/future');
  Fiber = Npm.require('fibers');

  Messages._ensureIndex({
    createdAt: 1
  }, {
    expireAfterSeconds: 10
  });

  // code to run on server at startup
  // mockCrates(30,_.noop);
  // mockUsers(30, function() {
  //   mockCrates(5, function() {
  //     mockTransactions(3);
  //     mockRoles();
  //     });
  //   });
  // });
  // mockPages();
  // mockNews(8);

  if(Pages.find().count() <= 0){
    mockPages();
  }
  if(Meteor.roles.find().count() <= 0){
    mockRoles();
  }
});
