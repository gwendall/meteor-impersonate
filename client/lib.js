Impersonate = { _user: null };

Impersonate.do = function(userId) {
  if (!Impersonate._user) Impersonate._user = Meteor.userId(); // First impersonation
  Meteor.connection.setUserId(userId);
}

Impersonate.undo = function() {
  if (Impersonate._user) Meteor.connection.setUserId(Impersonate._user);
}

Handlebars.registerHelper('isImpersonating', function () {
  return !!Impersonate._user;
});

Template.body.events({
  "click [data-impersonate]": function(e, data) {
    var userId = $(e.currentTarget).attr("data-impersonate");
    Meteor.call("impersonate", userId, function(err) {
      if (!err) Impersonate.do(userId);
    });
  },
  "click [data-unimpersonate]": function(e, data) {
    Impersonate.undo();
  }
});
