// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  db: {
    uri: 'https://posmap-api.herokuapp.com/v1/graphql',
    user: '',
    pass: ''
  },
  auth: {
    twitter: {
      apiKey: 'TWITTER_AUTH_API_KEY',
      secret: 'TWITTER_AUTH_API_SECRET'
    }
  },
  firebaseConfig: {
    apiKey: "AIzaSyDv28oICwCJZjr1Z5l1_eswWreIdZSTO-I",
    authDomain: "posmapp-8a86e.firebaseapp.com",
    databaseURL: "https://posmapp-8a86e.firebaseio.com",
    projectId: "posmapp-8a86e",
    storageBucket: "posmapp-8a86e.appspot.com",
    messagingSenderId: "223060799011",
    appId: "1:223060799011:web:367795049525f4d4398b96",
    measurementId: "G-357D4HRGCJ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
