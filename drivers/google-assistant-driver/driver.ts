import Homey from 'homey';
import { json } from 'stream/consumers';

const { OAuth2Driver } = require('homey-oauth2app');
const path = require('path');
const GoogleAssistant = require('google-assistant');

module.exports = class MyBrandDriver extends OAuth2Driver {

  async onOAuth2Init() {
    // Register Flow Cards etc.

    await super.onOAuth2Init();

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

    

    let data = await oAuth2Client.getThings(params);

    //console.log("DATA",data);

    /*var jsonData = data.toJSON();

    console.log("JSON",jsonData);*/

    /*console.log(jsonData.token);

    var hmy = this.homey;  

    hmy.set("token", jsonData.token, function (err) {
      if (err) {
        hmy.alert(err);
      } 
    });*/

    var devices: object[] = [];
    for (let i=0; i<1; i++){
      var newDevice = { data: { id: "google-assistant-driver"}, name: "Google Assistant Driver", settings: { token: "token", oauth: oAuth2Client }}
      devices.push(newDevice);
    }
    return devices;
  

   

  }

}
