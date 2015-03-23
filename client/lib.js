Impersonate = { _user: null };

Impersonate.do = function(userId, cb) {
  Meteor.call("impersonate", userId, function(err, res) {
    if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res]);
    if (err) return;
    if (!Impersonate._user) Impersonate._user = Meteor.userId(); // First impersonation
    Meteor.connection.setUserId(userId);
  });
}

Impersonate.undo = function(cb) {
  Impersonate.do(Impersonate._user, cb);
}

Template.body.events({
  "click [data-impersonate]": function(e, data) {
    var userId = $(e.currentTarget).attr("data-impersonate");
    Impersonate.do(userId);
  },
  "click [data-unimpersonate]": function(e, data) {
    Impersonate.undo(function(err, userId) {
      if (!err) Impersonate._user = null;
    });
  }
});

UI.registerHelper("isImpersonating", function () {
  return !!Impersonate._user;
});
