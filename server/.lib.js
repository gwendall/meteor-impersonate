Impersonate = { admins: ["admin"] };

// Reset all tokens
Meteor.startup(function() {
  var selector = { _impersonateToken: { $exists: true }};
  var modifier = { $unset: { _impersonateToken: "" }};
  var options = { multi: true };
  Meteor.users.update(selector, modifier, options);
});

Meteor.methods({
  impersonate: function(params) {

    var currentUser = this.userId;
    check(currentUser, String);
    check(params, Object);
    check(params.toUser, String);

    if (params.fromUser || params.token) {
      check(params.fromUser, String);
      check(params.token, String);
    }

    if (!Meteor.users.findOne({ _id: params.toUser })) {
      throw new Meteor.Error(404, "User not found. Can't impersonate it.");
    }

    if (!params.token && !Roles.userIsInRole(currentUser, Impersonate.admins)) {
      throw new Meteor.Error(403, "Permission denied. You need to be an admin to impersonate users.");
    }

    if (params.token) {
      // Impersonating with a token
      var selector = {
        "_id": params.fromUser,
        "services.impersonate.token": params.token
      };
      var isValid = !!Meteor.users.findOne(selector);
      if (!isValid) {
        throw new Meteor.Error(403, "Permission denied. Can't impersonate with this token.");
      }
    } else {
      // Impersonating with no token
      var user = Meteor.users.findOne({ _id: currentUser }) || {};
      params.token = Meteor._get(user, "services", "resume", "loginTokens", 0, "hashedToken");
      /*
      var selector = { _id: currentUser };
      var modifier = { $set: { _impersonateToken: params.token }};
      Meteor.users.update(selector, modifier);
      */
    }

    this.setUserId(params.toUser);
    return { fromUser: currentUser, toUser: params.toUser, token: params.token };

  }
});
