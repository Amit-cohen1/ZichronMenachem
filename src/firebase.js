import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjkoXIgxOC-v3g-1uhD0gxKpm3OmdNBCo",
  authDomain: "zichron-menachem.firebaseapp.com",
  projectId: "zichron-menachem",
  storageBucket: "zichron-menachem.appspot.com",
  messagingSenderId: "781813828342",
  appId: "1:781813828342:web:0665f87adac2c06d4dbad7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
