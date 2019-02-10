var config = {
  apiKey: "AIzaSyArNQYfE-n9FtJKWUz0t62pxPR3zQ8Rx5g",
  authDomain: "secret-voice-195911.firebaseapp.com",
  databaseURL: "https://secret-voice-195911.firebaseio.com",
  projectId: "secret-voice-195911",
  storageBucket: "secret-voice-195911.appspot.com",
  messagingSenderId: "771139968231"
};
firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

