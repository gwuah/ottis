# Xann
:cop: An authorization library for express applications. <br>
This library is aimed at potentially large applications that has numerous user entities. <br>
This library's importance might not be felt if you just want to build a tiny backend for your application.


# Usage :
Routes are parsed with regex, hence you should declare them in the order which they are arranged in your main application. Else you'll match the wrong routes. This is a pattern that goes goes way back to expressjs itself.

```javascript
// filename: auth.js 
const Xann = require('../lib');
const router = Xann.router;

const auth = Xann({
  users: ["admin","manager"]
});

// looad configuration for various users
auth
.addConfigFor('admin')
.forResource('customers')({
  config: [router().all()]
}) 
.forResource('anonymous-customers')({
  config: [router().all()]
}).forResource('products')({
  config: [
    router("/").get().post().done(),
    router("/:id").get().put().delete().done(),
    router("/:id/location/:name").get().done()
  ]
})

module.exports = auth.User;
```

```javascript
// filename: middleware.js

const User = require('./auth.js');

function authorizeRequestTo(resource) {
  return (req, res, next) {
    /* 
      This is all on you. You can decide to populate 
      the user's rolename on a different variable
      (other than roleName). This just an example. 
    */
    const roleName = req.user.role.toLowercase();
    const canAccess = User(roleName).canAccess({
      resource: resource.toLowerCase(), 
      request: req
    });
    if (canAccess) {
      next()
    } else {
      next(new unAuthorizedError())
    }
  }
}

function authenticateRequest() {
  /* your authentication code here */
}

module.exports = {
  authenticateRequest,
  authorizeRequestTo
}

```

```javascript
// filename: routes/customers.js

const {authorizeRequestTo} = require('./middleware.js');
const router = require('express').Router;

router('/', authorizeRequestTo('customers'), (req, res) => {
  console.log('admin can access this route')
})
```

```javascript
// filename: routes/anonymousUsers.js

const {authorizeRequestTo} = require('./middleware.js');
const router = require('express').Router;

router('/', authorizeRequestTo('anonymous-users'), (req, res) => {
  console.log('admin can access this route')
})
```
