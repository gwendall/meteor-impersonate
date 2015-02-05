Package.describe({
  name: "gwendall:impersonate",
  summary: "Impersonate users in Meteor",
  version: "0.1.0"
});

Package.on_use(function (api, where) {

  api.use([
    "templating",
    "gwendall:body-events"
  ], "client");

  api.use([
    "alanning:roles@1.2.12",
  ]);

  api.add_files([
    "server/lib.js"
  ], "server");

  api.add_files([
    "client/lib.js"
  ], "client");

});
