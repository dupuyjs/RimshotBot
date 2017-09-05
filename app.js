// This loads the environment variables from the .env file
require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');
var telemetryModule = require('./telemetry-module.js');

var appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATION_KEY).start();
var appInsightsClient = appInsights.getClient();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {

    //var telemetry = telemetryModule.createTelemetry(session, { setDefault: true });

    session.replaceDialog('HelpDialog');


    //appInsightsClient.trackTrace('start', telemetry);
});

bot.dialog('HelpDialog', function (session) {
    var card = new builder.HeroCard(session)
        .title('Roller Options')
            .buttons([
                builder.CardAction.imBack(session, 'roll some dice', 'Roll Dice'),
                builder.CardAction.imBack(session, 'play craps', 'Play Craps')
            ]);
    
        var msg = new builder.Message(session)
            .text('Test')
            .speak('This is a test')
            .addAttachment(card)
            .inputHint(builder.InputHint.acceptingInput);
    
        session.send(msg).endDialog();
    
}).triggerAction({ matches: /help/i });