Package.describe({
  name: "gwendall:impersonate",
  summary: "Impersonate users in Meteor",
  version: "0.1.8"
});

Package.on_use(function (api, where) {

  api.use([
    "reactive-var@1.0.5",
    "templating@1.0.11",
    "gwendall:body-events@0.1.4"
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
