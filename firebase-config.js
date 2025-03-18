// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAkCEHAwG2pbPGbRXVPutzXD43FcmAG-7I",
  authDomain: "adventure-card-project.firebaseapp.com",
  projectId: "adventure-card-project",
  storageBucket: "adventure-card-project.appspot.com",
  messagingSenderId: "850675878938",
  appId: "1:850675878938:web:2436d974f2d0513e6ed5a3"
};

// 初始化 Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// 初始化 Firestore
const db = firebase.firestore();

// 初始化 Auth
const auth = firebase.auth();
