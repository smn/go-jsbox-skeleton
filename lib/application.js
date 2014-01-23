var vumigo = require("vumigo_v01");
var jed = require("jed");

if (api === undefined) {
  // testing hook (supplies api when it is not passed in by the real sandbox)
  var api = this.api = new vumigo.dummy_api.DummyApi();
}

var FreeText = vumigo.states.FreeText;
var EndState = vumigo.states.EndState;
var ChoiceState = vumigo.states.ChoiceState;
var PaginatedChoiceState = vumigo.states.PaginatedChoiceState;
var Choice = vumigo.states.Choice;
var InteractionMachine = vumigo.state_machine.InteractionMachine;
var StateCreator = vumigo.state_machine.StateCreator;
var HttpApi = vumigo.http_api.HttpApi;
var Promise = vumigo.promise.Promise;


function Application() {
    var self = this;
    StateCreator.call(self, 'start');

    self.add_state(new ChoiceState(
        'start',
        function(choice) {
            return choice.value;
        },
        'Hi there! What do you want to do?',
        [
            new Choice('start', 'Show this menu again.'),
            new Choice('end', 'Exit.')
        ]
    ));

    self.add_state(new EndState(
        'end',
        'Thanks, cheers!',
        'start'
    ));
}

// launch app
var states = new Application();
var im = new InteractionMachine(api, states);
im.attach();
