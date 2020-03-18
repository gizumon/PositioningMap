export const enviroment = {
  production: true,
  db: {
    uri: 'https://posmap-api.herokuapp.com/v1/graphql',
    user: '',
    pass: ''
  },
  auth: {
    twitter: {
      apiKey: 'TWITTER_AUTH_API_KEY',
      secret: 'TWITTER_AUTH_API_SECRET'
    },
    anonymous: {
      auth_id: 'guest'
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
