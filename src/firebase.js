import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBp4WpG7IBnrJwdMvniU70u2dvsZuk6_WE",
  authDomain: "quizarau.firebaseapp.com",
  projectId: "quizarau",
  storageBucket: "quizarau.firebasestorage.app",
  messagingSenderId: "878014863769",
  appId: "1:878014863769:web:7543a0d742dd0f69f35b08",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
