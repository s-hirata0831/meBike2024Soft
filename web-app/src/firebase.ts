//firebase, firestoreの初期設定
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyB8_4OjddWjfqYB-AHioR10ox7FoCSQAzk",
    authDomain: "me-bike-24.firebaseapp.com",
    projectId: "me-bike-24",
    storageBucket: "me-bike-24.appspot.com",
    messagingSenderId: "613849080583",
    appId: "1:613849080583:web:c9ff1fb9b5cb42686d1ba2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;