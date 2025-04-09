import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCof6x4nXK1rKaTKAnyETLz9Ej33g_CL0c",
  projectId: "gestionnaire-de-fiches",
  authDomain: "gestionnaire-de-fiches.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);