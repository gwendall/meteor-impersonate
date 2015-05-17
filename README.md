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

Notes
-----

- Uses alanning:roles. If the user trying to impersonate is not an admin, a server error will be returned.
- The package creates a "_impersonateToken" property on the impersonating admins' documents. Make sure not to send this property to other users than the admin themselves, as it would offer the possibility to those other users to impersonate too.  
- Built upon [David Weldon](https://dweldon.silvrback.com/impersonating-a-user)'s post
