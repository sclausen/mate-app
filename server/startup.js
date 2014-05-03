Meteor.startup(function() {
  ServiceConfiguration.configurations.remove({
    service: "github"
  });
  ServiceConfiguration.configurations.insert({
    service: "github",
    clientId: "your-github-clientId",
    secret: "your-github-secret"
  });
  // mockUsers(30, function() {
  //   mockCrates(5, function() {
  //     mockTransactions(3);
  //     mockRoles();
  //   });
  // });
  // mockTranslations();
  // mockPages();
  // mockNews(8);

  // Grant the user admin rights
  // Meteor.users.update({
  //   username: "your github username"
  // }, {
  //   $set: {
  //     "roles": ["admin", "users:read", "users:update"]
  //   }
  // });
});