
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCC318cefZkHiYh5jZJ1fedAiXl6B3AQN0",
  authDomain: "fest-management2.firebaseapp.com",
  projectId: "fest-management2",
  storageBucket: "fest-management2.appspot.com",
  messagingSenderId: "210352364144",
  appId: "1:210352364144:web:855027cf0ba0092bc9f2b5",
  measurementId: "G-QTX8D3R0K1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { db, storage,auth };