Meteor.methods({
  "impersonate": function(userId) {

    check(userId, String);

    if (!Meteor.users.findOne({ _id: userId })) {
      throw new Meteor.Error(404, "User not found. Can't impersonate it.");
    }

    if (!Roles.userIsInRole(this.userId, ["admin"])) {
      throw new Meteor.Error(403, "Permission denied. You need to be an admin to impersonate users.");
    }

    this.setUserId(userId);

  }
});
