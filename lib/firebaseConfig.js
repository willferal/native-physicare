import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBUnUauFr_3gv18Uq-BarSZzY7e1Xs0bow",
//   authDomain: "physicare-mobile-dev.firebaseapp.com",
//   projectId: "physicare-mobile-dev",
//   storageBucket: "physicare-mobile-dev.appspot.com",
//   messagingSenderId: "1091383457523",
//   appId: "1:1091383457523:web:8bef25abb44191dcb0e986",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
// export const firestore = getFirestore(app);
// export const storage = getStorage(app);


const firebaseConfig = {
  apiKey: "AIzaSyC48IWuQ_aqH72ecfAMpbQMf5rP7O52ohQ",
  authDomain: "physicare-1f88a.firebaseapp.com",
  projectId: "physicare-1f88a",
  storageBucket: "physicare-1f88a.appspot.com",
  messagingSenderId: "331701498553",
  appId: "1:331701498553:web:c94a2246727d420b5c6168",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);