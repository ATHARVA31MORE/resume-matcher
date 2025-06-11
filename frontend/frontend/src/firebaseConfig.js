import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD6SmhwkZrC6ivW-0a_C0wVKthsaXkf680",
    authDomain: "resume-f88f5.firebaseapp.com",
    projectId: "resume-f88f5",
    storageBucket: "resume-f88f5.firebasestorage.app",
    messagingSenderId: "549826575421",
    appId: "1:549826575421:web:29b61028ba4feba03bfe54",
    measurementId: "G-6RCR41ZFWH"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
