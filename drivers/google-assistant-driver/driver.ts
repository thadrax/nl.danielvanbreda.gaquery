import Homey from 'homey';

const { OAuth2Driver } = require('homey-oauth2app');

module.exports = class MyBrandDriver extends OAuth2Driver {

  async onOAuth2Init() {
    // Register Flow Cards etc.
  }

  async onPairListDevices({ oAuth2Client }) {

    const settings = this.homey.settings;
    const CLIENT_ID = settings.get('clientid');
		const CLIENT_SECRET = settings.get('clientsecret');
		const TOKEN = settings.get('token');

    const SCOPES = [ 'https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email' ];
    const REDIRECT_URI = 'https://callback.athom.com/oauth2/callback'; // Default: 'https://callback.athom.com/oauth2/callback'

    var params = { "client_id": encodeURIComponent(CLIENT_ID), "client_secret" : encodeURIComponent(CLIENT_SECRET), "redirect_uri" : encodeURIComponent(REDIRECT_URI), "scope" : SCOPES }

    console.log(params);

    const things = await oAuth2Client.getThings(params);

    console.log(things);

   

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
