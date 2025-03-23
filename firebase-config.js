// 確保只初始化一次
if (typeof window.myFirebaseApp === 'undefined') {
    const config = {
        apiKey: "AIzaSyAkCEHAwG2pbPGbRXVPutzXD43FcmAG-7I",
        authDomain: "adventure-card-project.firebaseapp.com",
        projectId: "adventure-card-project",
        storageBucket: "adventure-card-project.appspot.com",
        messagingSenderId: "850675878938",
        appId: "1:850675878938:web:2436d974f2d0513e6ed5a3"
    };

    // 初始化 Firebase
    window.myFirebaseApp = firebase.initializeApp(config);
}

// 確保這些變數可以全局訪問
window.db = firebase.firestore();
window.auth = firebase.auth();
