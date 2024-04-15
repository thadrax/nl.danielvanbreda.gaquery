import Homey from 'homey';

const { OAuth2Driver } = require('homey-oauth2app');
const path = require('path');
const GoogleAssistant = require('google-assistant');

module.exports = class MyBrandDriver extends OAuth2Driver {

  async onOAuth2Init() {
    // Register Flow Cards etc.

    this.homey.flow.getActionCard('query')
      .registerRunListener((args, state) => {
          return new Promise((resolve, reject) => {
      
      
      //https://www.npmjs.com/package/google-assistant
    
      const config = {
        auth: {
          keyFilePath: path.resolve(__dirname, './lib/devicecredentials.json'),
          // where you want the tokens to be saved
          // will create the directory if not already there
          savedTokensPath: path.resolve(__dirname, './lib/tokens.json'),
          // you can also pass an oauth2 client instead if you've handled
          // auth in a different workflow. This trumps the other params.
          //oauth2Client: MyBrandOAuth2Client
      
        },
        // this param is optional, but all options will be shown
        conversation: {
        
          textQuery: args.query, // if this is set, audio input is ignored
          isNew: args.new, // set this to true if you want to force a new conversation and ignore the old state
          screen: {
            isOn: true, // set this to true if you want to output results to a screen
          },
        },
      };

      this.log(config.auth);

      
      const assistant = new GoogleAssistant(config.auth);
      
      this.log("assistant ready");

      // starts a new conversation with the assistant
      const startConversation = (conversation) => {
        // setup the conversation and send data to it
        // for a full example, see `examples/mic-speaker.js`

        conversation
          .on('audio-data', (data) => {
            // do stuff with the audio data from the server
            // usually send it to some audio output / file
          })
          .on('end-of-utterance', () => {
            // do stuff when done speaking to the assistant
            // usually just stop your audio input
          })
          .on('transcription', (data) => {
            // do stuff with the words you are saying to the assistant
          })
          .on('response', (text) => {
            // do stuff with the text that the assistant said back
          })
          .on('volume-percent', (percent) => {
            // do stuff with a volume percent change (range from 1-100)
          })
          .on('device-action', (action) => {
            // if you've set this device up to handle actions, you'll get that here
          })
          .on('screen-data', (screen) => {
            // if the screen.isOn flag was set to true, you'll get the format and data of the output
          })
          .on('ended', (error, continueConversation) => {
            // once the conversation is ended, see if we need to follow up
            if (error) console.log('Conversation Ended Error:', error);
            else if (continueConversation) assistant.start();
            else console.log('Conversation Complete');
          })
          .on('data', (data) => {
            // raw data from the google assistant conversation
            // useful for debugging or if something is not covered above
          })
          .on('error', (error) => {
          
          this.log(error);
            // handle error messages
          })
      };

      // will start a conversation and wait for audio data
      // as soon as it's ready
      assistant
        .on('ready', () => assistant.start(config.conversation))
        .on('started', startConversation);
      
      
        
      
          });
      })

  }

  async onPairListDevices({ oAuth2Client }) {

    const settings = this.homey.settings;
    const CLIENT_ID = settings.get('clientid');
		const CLIENT_SECRET = settings.get('clientsecret');
		const TOKEN = settings.get('token');

    const SCOPES = [ 'https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email' ];
   const REDIRECT_URI = 'https://callback.athom.com/oauth2/callback'; // Default: 'https://callback.athom.com/oauth2/callback'

   
   

    var params = { client_id: encodeURIComponent(CLIENT_ID), /*client_secret : encodeURIComponent(CLIENT_SECRET),*/ redirect_uri : (REDIRECT_URI), scope : SCOPES.join(" ") }

    console.log("https://accounts.google.com/o/oauth2/auth?response_type=code" + "&client_id="+ CLIENT_ID /*"&client_secret="+ CLIENT_SECRET+ */ + "&redirect_uri="+ REDIRECT_URI + "&scope="+ SCOPES.join(" ")  )
    console.log("PARAMS",params);

    const things = await oAuth2Client.getThings(params);

    console.log("THINGS",things);

   

    return things?.map(thing => {
      return {
        name: thing.name,
        data: {
          id: thing.id,
        },
      }
    });
  }

}
