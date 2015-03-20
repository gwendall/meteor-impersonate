Meteor Impersonate
================

Let admins impersonate other users

Installation
------------

``` sh
meteor add gwendall:impersonate
```

Methods
-------

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

Notes
-----

- Uses alanning:roles. If the user trying to impersonate is not an admin, a server error will be returned.
- Built upon [David Weldon](https://dweldon.silvrback.com/impersonating-a-user)'s post
