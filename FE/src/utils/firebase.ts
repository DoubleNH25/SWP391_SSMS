// src/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔧 Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJ_5L_a9dnp2YBUjmKt6lJ6UOiZyjhN90",
  authDomain: "bloodplus-e8d34.firebaseapp.com",
  projectId: "bloodplus-e8d34",
  storageBucket: "bloodplus-e8d34.appspot.com",
  messagingSenderId: "200053914917",
  appId: "1:200053914917:web:7f3ae98888de169d6baecc",
  measurementId: "G-BSEZSFT5V8",
};

// 🧠 Chỉ khởi tạo nếu chưa có app (hỗ trợ hot reload trong dev)
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Khởi tạo Firebase Auth
const auth = getAuth(firebaseApp);
auth.useDeviceLanguage(); // hoặc dùng: auth.useDeviceLanguage();

export {auth};
