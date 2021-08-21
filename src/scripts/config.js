const API_KEY = process.env.API_KEY;
const APP_ID = process.env.APP_ID;

const script = document.createElement("script");
// initial firebase
script.innerHTML = `    
const firebaseConfig = {
    apiKey: "${API_KEY}",
    authDomain: "modern-jvs.firebaseapp.com",
    projectId: "modern-jvs",
    storageBucket: "modern-jvs.appspot.com",
    messagingSenderId: "682144169136",
    appId: "${APP_ID}",
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.firestore();
  const functions = firebase.functions();
  `;

document.body.append(script)
