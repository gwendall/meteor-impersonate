Impersonate = { _user: null };

Impersonate.do = function(userId, callback) {
  Meteor.call("impersonate", userId, function(err, res) {
    if (callback) {
      var user = err ? null : Meteor.users.findOne({ _id: userId });
      callback.apply(this, [err, user]);
    }
    if (err) return;
    if (!Impersonate._user) Impersonate._user = Meteor.userId(); // First impersonation
    Meteor.connection.setUserId(userId);
  });
}

Impersonate.undo = function(callback) {
  if (!Impersonate._user) return console.log("Could not un-impersonate.");
  Impersonate.do(Impersonate._user, callback);
}

Template.body.events({
  "click [data-impersonate]": function(e, data) {
    var userId = $(e.currentTarget).attr("data-impersonate");
    Impersonate.do(userId);
  },
  "click [data-unimpersonate]": function(e, data) {
    Impersonate.undo();
  }
});

UI.registerHelper("isImpersonating", function () {
  return !!Impersonate._user;
});
