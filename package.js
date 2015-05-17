Package.describe({
  name: "gwendall:impersonate",
  summary: "Impersonate users in Meteor",
  version: "0.2.1",
  git: "https://github.com/gwendall/meteor-impersonate.git",
});

Package.onUse(function (api, where) {

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

  api.addFiles([
    "server/lib.js"
  ], "server");

  api.addFiles([
    "client/lib.js"
  ], "client");

  api.export("Impersonate");

});
