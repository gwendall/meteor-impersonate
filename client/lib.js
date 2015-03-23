Impersonate = { _user: new ReactiveVar(null) };

Impersonate.do = function(userId, cb) {
  Meteor.call("impersonate", userId, function(err, res) {
    if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res]);
    if (err) return;
    if (!Impersonate._user.get()) Impersonate._user.set(Meteor.userId()); // First impersonation
    Meteor.connection.setUserId(userId);
  });
}

Impersonate.undo = function(cb) {
  Impersonate.do(Impersonate._user, function(err, userId) {
    if (!err) Impersonate._user.set(null);
    if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, userId]);
  });
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

Template.registerHelper("isImpersonating", function () {
  return !!Impersonate._user.get();
});
