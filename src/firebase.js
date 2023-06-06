import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjkoXIgxOC-v3g-1uhD0gxKpm3OmdNBCo",
  authDomain: "zichron-menachem.firebaseapp.com",
  projectId: "zichron-menachem",
  messagingSenderId: "781813828342",
  appId: "1:781813828342:web:0665f87adac2c06d4dbad7",
  storageBucket: "gs://zichron-menachem.appspot.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, collection, storage };
