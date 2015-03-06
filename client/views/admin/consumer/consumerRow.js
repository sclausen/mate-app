Template.consumerRow.helpers({
  userName: function() {
    return this.username ? this.username : this.profile.name;
  }
});
