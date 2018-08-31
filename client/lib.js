Impersonate = { _user: null, _token: null, _active: new ReactiveVar(false) };

Impersonate.do = function(toUser, cb) {
  var params = { toUser: toUser };
  if (Impersonate._user) {
    params.fromUser = Impersonate._user;
    params.token = Impersonate._token;
  }
  Meteor.call("impersonate", params, function(err, res) {
    if (err) console.log("Could not impersonate.", err);
    if (!err) {
      if (!Impersonate._user) {
        Impersonate._user = res.fromUser; // First impersonation
        Impersonate._token = res.token;
      }
      Impersonate._active.set(true);
      Meteor.connection.setUserId(res.toUser);
    }
    if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res.toUser]);
  });
}

Impersonate.undo = function(cb) {
  Impersonate.do(Impersonate._user, function(err, res) {
    if (!err) Impersonate._active.set(false);
    if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res.toUser]);
  });
}

// Reset data on logout
Tracker.autorun(function() {
  if (Meteor.userId()) return;
  Impersonate._active.set(false);
  Impersonate._user = null;
  Impersonate._token = null;
});

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
