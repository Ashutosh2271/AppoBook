// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import  {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore"
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1uhUzhJfejPX45rQG7uU16BU0KWc-vtA",
  authDomain: "appobook-5ef2b.firebaseapp.com",
  projectId: "appobook-5ef2b",
  storageBucket: "appobook-5ef2b.firebasestorage.app",
  messagingSenderId: "102405265846",
  appId: "1:102405265846:web:7970e9ad6e454a0c768917",
  dataBaseUrl:""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export const db = getFirestore(app);   
export const googleprovider = new GoogleAuthProvider(auth) 
export const storage = getStorage(app)

export {app,auth}