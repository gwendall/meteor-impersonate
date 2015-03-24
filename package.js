Package.describe({
  name: "gwendall:impersonate",
  summary: "Impersonate users in Meteor",
  version: "0.2.0"
});

Package.on_use(function (api, where) {

  api.use([
    "accounts-base@1.2.0",
    "reactive-var@1.0.5",
    "templating@1.0.11",
    "gwendall:body-events@0.1.4"
  ], "client");

  api.use([
    "random@1.0.3",
    "alanning:roles@1.2.12",
  ]);

  api.add_files([
    "server/lib.js"
  ], "server");

  api.add_files([
    "client/lib.js"
  ], "client");

  api.export("Impersonate");

});
