import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCl24z3KL07CnZ1wFexfIUtR0jzwXu1i0I",
  authDomain: "task-manager-xxxxx.firebaseapp.com",
  projectId: "task-manager-xxxxx",
  storageBucket: "task-manager-xxxxx.appspot.com",
  messagingSenderId: "xxxxx",
  appId: "1:xxxxx:web:xxxxx"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);