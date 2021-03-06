const Ottis = require('../lib');
const router = Ottis.router;

const auth = Ottis(["admin","manager"]);

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

// const regexparam = require('regexparam');
// console.log(auth.opts.users.admin.resources.customers.config[0].regex.pattern.test("/:id"));
// let foo = regexparam('users/*');
// console.log(foo.pattern.test('/users/:name'));
// console.log(/^\/*/.test("/hello/world"))

console.log(auth.User('admin').canAccess({
  resource:'products', 
  request: {method: 'PUT', url: '/dsjdhash'}
}))