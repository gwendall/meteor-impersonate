Meteor Impersonate
================

Let admins impersonate other users

Installation
------------

``` sh
meteor add gwendall:impersonate
```

How to
-------

Set a [data-impersonate] attribute with the id of the user to impersonate on a DOM element.
``` html
<button data-impersonate="{{someUser._id}}">Click to impersonate</button>
```

Notes
-----

- Uses alanning:roles. If the user trying to impersonate is not an admin, a server error will be returned.
- Built upon [David Weldon](https://dweldon.silvrback.com/impersonating-a-user)'s post
