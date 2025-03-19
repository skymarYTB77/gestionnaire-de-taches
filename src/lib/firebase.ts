import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

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

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('La persistance hors ligne nécessite un seul onglet ouvert à la fois.');
  } else if (err.code === 'unimplemented') {
    console.warn('Le navigateur ne supporte pas la persistance hors ligne.');
  }
});