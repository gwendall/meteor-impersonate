Meteor Impersonate
================

Let admins impersonate other users

Installation
------------

``` sh
meteor add gwendall:impersonate
```

DOM helpers
-----------

**Impersonate**  
Set a [data-impersonate] attribute with the id of the user to impersonate on a DOM element.
``` html
<button data-impersonate="{{someUser._id}}">Click to impersonate</button>
```

**Un-impersonate**  
Set a [data-unimpersonate] attribute to a DOM element.
``` html
<button data-unimpersonate>Click to unimpersonate</button>
```

UI helpers
----------

**isImpersonating**  
``` html
{{#if isImpersonating}}
  <button data-unimpersonate>Click to unimpersonate</button>
{{else}}
  <button data-impersonate="{{_id}}">Click to impersonate</button>
{{/if}}
```

Client Methods
-------

Should you need to use callbacks, use the JS methods directly.  

**Impersonate.do(userId, callback)**  
``` javascript
var userId = "...";
Impersonate.do(userId, function(err, userId) {
  if (err) return;
  console.log("You are now impersonating user #" + userId);
});
```

**Impersonate.undo(callback)**  
``` javascript
Impersonate.undo(function(err, userId) {
  if (err) return;
  console.log("Impersonating no more, welcome back #" + userId);
})
```

**Impersonate.isActive() - reactive method**  
``` javascript
if (Impersonate.isActive()) {
  // do something e.g. show some UX 
  // This method is handy if you're not using Blaze (otherwise you can use template helpers above)
}
```

Server Methods
-------

By default, the package will grant users in the "admins" group (through alanning:roles) the possibility to impersonate other users. You can also set any of the two following parameters to define your own impersonation roles.

- User role
``` javascript
Impersonate.admins = ["masters", "bosses"];
```

- User group
``` javascript
Impersonate.adminGroups = [
  { role: "masters", group: "group_A" },
  { role: "bosses", group: "group_B" }
];
```

If you need more control over who can impersonate other users you can define a custom auth check method. It will recieve 2 arguments - `fromUser` - the 'original' user, and `toUser` - the user we're about to impersonate. Note that when we're undoing impersonate then `fromUser` and `toUser` are both the same; they're both the 'original' user id. 

- Custom auth check - throw error if not authorized
``` javascript
Impersonate.checkAuth = function(fromUser, toUser) {
  
  // Auth Logic Here. 
  
  // If the action is allowed, return.
  
  // If the action is not allowed, throw a 403 error.
  
  if (!authorized) {
    throw new Meteor.Error(403, "Permission denied. You do not have permission to impersonate users.");
  }

};
```

If you need things to happen on the server right before or after the user is switched, you can define the following hooks.

- Before switch user
``` javascript
Impersonate.beforeSwitchUser = function(fromUser, toUser) {}
```

- After switch user
``` javascri
Impersonate.afterSwitchUser = function(fromUser, toUser) {}
```

Note that `Impersonate.checkAuth`, `Impersonate.beforeSwitchUser`, and `Impersonate.afterSwitchUser` are called with `this` are bound to the Impersonate Meteor Method. Thus you can - for example - access `this.connection` within these methods. Also if you are undoing impersonate and want to know the the userId you just impersonated you can use `this.userId` in `Impersonate.beforeSwitchUser` (fromUser is always the "original" user - see above). 

Notes
-----

- Default auth check uses alanning:roles. If the user trying to impersonate is not an admin, a server error will be returned.
- Built upon [David Weldon](https://dweldon.silvrback.com/impersonating-a-user)'s post
