 
 import firebase from 'firebase/app'
 import 'firebase/firestore'
 import 'firebase/storage'
 
 
 
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyBlo4n3c4ElvQcJQhUk1K4xzgfsOM5_N2I",
    authDomain: "test-day-one.firebaseapp.com",
    projectId: "test-day-one",
    storageBucket: "test-day-one.appspot.com",
    messagingSenderId: "950539776425",
    appId: "1:950539776425:web:4d4c652c90221bd55514b8"

    // apiKey: process.env.REACT_APP_API,
    // authDomain: process.env.REACT_APP_DOMAIN,
    // projectId: process.env.REACT_REACT_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_STORAGE,
    // messagingSenderId: process.env.REACT_APP_SENDER_ID,
    // appId: process.env.REACT_APP_APP_ID,
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase