// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXWThbJTMrTTiRy5gYtuUUNaXLW9_pW18",
  authDomain: "sales-manager-transcripts.firebaseapp.com",
  projectId: "sales-manager-transcripts",
  storageBucket: "sales-manager-transcripts.appspot.com",
  messagingSenderId: "812091062788",
  appId: "1:812091062788:web:07ce4bfac5a9d446b41351",
  measurementId: "G-QGQ5NVHXWS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const storageRef = ref(storage);
