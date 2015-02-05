Template.body.events({
  "click [data-impersonate]": function(e, data) {
    var userId = $(e.currentTarget).attr("data-impersonate");
    Meteor.call("impersonate", userId, function(err) {
      if (!err) Meteor.connection.setUserId(userId);
    });
  }
});
