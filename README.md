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

Methods
-------

Should you need to use callbacks, use the JS methods directly.  

**Impersonate.do(userId, callback)**  
``` javascript
var userId = "[...]";
Impersonate.do(userId, function(err, user) {
  if (err) return;
  console.log("You are now impersonating " + user.profile.name);
});
```

**Impersonate.undo(callback)**  
``` javascript
Impersonate.undo(function(err, user) {
  if (err) return;
  console.log("Impersonating no more, welcome back " + user.profile.name);
})
```

Notes
-----

- Uses alanning:roles. If the user trying to impersonate is not an admin, a server error will be returned.
- Built upon [David Weldon](https://dweldon.silvrback.com/impersonating-a-user)'s post
