Impersonate = {
  admins: ["admin"],
  adminGroups:[], // { role: "admin", group: "organization" }
};

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

    var roleAllow = false;
    // if there is any role, use that
    if (Impersonate.admins && Impersonate.admins.length) {
      roleAllow = Roles.userIsInRole(currentUser, Impersonate.admins);
    } else {
      // else, single roles have been removed, check roles-groups have been added
      if (Impersonate.adminGroups) {
        // check for permissions using roles and groups
        for (var i = 0; i< Impersonate.adminGroups.length; i++ ) {
          var roleGroup = Impersonate.adminGroups[i];
          roleAllow = Roles.userIsInRole(currentUser, roleGroup.role, roleGroup.group);
          if (roleAllow) break; // found an allowable role, no need to check further, proceed
        }
      }
    }

    if (!params.token && !roleAllow) {
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
