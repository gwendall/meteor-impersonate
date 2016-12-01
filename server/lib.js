
var defaultAuthCheck = function(fromUser, toUser) {

  var roleAllow = false;
  // if there is any role, use that
  if (Impersonate.admins && Impersonate.admins.length) {
    roleAllow = Roles.userIsInRole(fromUser, Impersonate.admins);
  }

  if (Impersonate.adminGroups && !roleAllow) {
    // check for permissions using roles and groups
    for (var i = 0; i< Impersonate.adminGroups.length; i++ ) {
      var roleGroup = Impersonate.adminGroups[i];
      roleAllow = Roles.userIsInRole(fromUser, roleGroup.role, roleGroup.group);
      if (roleAllow) break; // found an allowable role, no need to check further, proceed
    }
  }

  if (!roleAllow) {
    throw new Meteor.Error(403, "Permission denied. You need to be an admin to impersonate users.");
  }

};


Impersonate = {
  admins: ["admin"],
  adminGroups:[], // { role: "admin", group: "organization" }
  checkAuth: defaultAuthCheck,
  beforeSwitchUser: function() {},
  afterSwitchUser: function() {},
};

//defaultAuthCheck

Meteor.methods({
  impersonate: function(params) {

    var currentUser = this.userId;

    check(currentUser, String);
    check(params, Object);
    check(params.toUser, String);


    // These props are set on every call except the first call.

    if (params.fromUser || params.token) {
      check(params.fromUser, String);
      check(params.token, String);
    }

    if (!Meteor.users.findOne({ _id: params.toUser })) {
      throw new Meteor.Error(404, "User not found. Can't impersonate it.");
    }


    if (params.token) {

      // Impersonating with a token
      // params.fromUser is always the "original" user.
      // When we call Impersonate.undo then toUser is the original user too.
      var fromUser = params.fromUser;

      // check the token is valid.
      var user = Meteor.users.findOne({ _id: fromUser }) || {};
      if (params.token != Meteor._get(user, "services", "resume", "loginTokens", 0, "hashedToken")) {
        throw new Meteor.Error(403, "Permission denied. Can't impersonate with this token.");
      }

    } else {

      // Impersonating with no token
      // This is the first call to Impersonate in this user's browser session
      // This user will be the "fromUser" from now on.
      var fromUser = currentUser;

      var user = Meteor.users.findOne({ _id: fromUser }) || {};
      params.token = Meteor._get(user, "services", "resume", "loginTokens", 0, "hashedToken");
    }


    // Check the fromUser is allowed to impersonate the toUser.
    // With the default auth method it's technically only necessary
    // to run this check on the first call but with other auth methods
    // that check the toUser as well you'll need to check every time.
    Impersonate.checkAuth(fromUser, params.toUser);

    // Pre action hook
    Impersonate.beforeSwitchUser(fromUser, params.toUser);

    // Switch user
    this.setUserId(params.toUser);

    // Post action hook
    Impersonate.afterSwitchUser(fromUser, params.toUser);

    return { fromUser: currentUser, toUser: params.toUser, token: params.token };

  }
});
