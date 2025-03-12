import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIZaSyBjeLZRhd-u3peiPd5eBcExxxXGDeERh88",  // Burada senin SDK içinde verilen apiKey olacak
  authDomain: "escafood-muhasebe-2.firebaseapp.com",
  projectId: "escafood-muhasebe-2",
  storageBucket: "escafood-muhasebe-2.appspot.com",
  messagingSenderId: "192904643406",
  appId: "1:192904643406:web:044a717fc8c624b0eb541f"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
