// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUKDyEMGitt7eeA0GzajM7KJjLywjl8kM",
  authDomain: "task-manager-482e5.firebaseapp.com",
  projectId: "task-manager-482e5",
  storageBucket: "task-manager-482e5.firebasestorage.app",
  messagingSenderId: "391778976778",
  appId: "1:391778976778:web:86f3fa2ba26b23527a8bf3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);