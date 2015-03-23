Impersonate = { _user: null, _active: new ReactiveVar(false) };

Impersonate.do = function(userId, cb) {
  Meteor.call("impersonate", userId, function(err, _userId) {
    if (!err) {
      Meteor.connection.setUserId(_userId);
      if (!Impersonate._user) Impersonate._user = Meteor.userId(); // First impersonation
      Impersonate._active.set(true);
    }
    if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, _userId]);
  });
}

Impersonate.undo = function(cb) {
  Impersonate.do(Impersonate._user, function(err, _userId) {
    if (!err) Impersonate._active.set(false);
    if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, _userId]);
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
  return Impersonate._active.get();
});
