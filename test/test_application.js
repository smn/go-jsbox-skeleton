var describe = global.describe,
  it = global.it,
  beforeEach = global.beforeEach;

var fs = require("fs");
var assert = require("assert");
var app = require("../lib/application");
var vumigo = require("vumigo_v01");

describe('Application', function () {

  var tester;
  var fixtures = [];

  describe('when using the app', function() {

    beforeEach(function () {
      tester = new vumigo.test_utils.ImTester(app.api, {
        custom_setup: function (api) {
          api.config_store.config = JSON.stringify({
              /*
              config: ["values", "here"]
              */
          });

          fixtures.forEach(function (f) {
            api.load_http_fixture(f);
          });
        },
        async: true
      });
    });

    it('should show the opening menu', function (done) {
      tester.check_state({
        user: null,
        content: null,
        next_state: 'start',
        response: /Hi there! What do you want to do\?\n1. Show this menu again.\n2. Exit/
      }).then(done, done);
    });

    it('should return to the opening menu', function (done) {
      tester.check_state({
        user: {
          current_state: 'start'
        },
        content: '1',
        next_state: 'start',
        response: /Hi there! What do you want to do\?\n1. Show this menu again.\n2. Exit/
      }).then(done, done);
    });

    it('should go to the end menu', function (done) {
      tester.check_state({
        user: {
          current_state: 'start'
        },
        content: '2',
        next_state: 'end',
        response: /Thanks, cheers!/,
        continue_session: false  // we expect the session to end here
      }).then(done, done);
    });

  });
});