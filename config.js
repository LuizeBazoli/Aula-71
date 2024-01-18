import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig={
    apiKey: "AIzaSyCSXyaAGfRxZVwKC0YrA1zTKqUySLPjhHQ",
    authDomain: "biblioteca-5c258.firebaseapp.com",
    projectId: "biblioteca-5c258",
    storageBucket: "biblioteca-5c258.appspot.com",
    messagingSenderId: "862427997571",
    appId: "1:862427997571:web:712bbe39a33edac43a02b6"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();