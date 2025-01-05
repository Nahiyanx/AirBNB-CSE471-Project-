// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cse471-6eed4.firebaseapp.com",
  projectId: "cse471-6eed4",
  storageBucket: "cse471-6eed4.firebasestorage.app",
  messagingSenderId: "426743267293",
  appId: "1:426743267293:web:17bcd417ef6e3741c10034"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);