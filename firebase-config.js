// firebase-config.js

// 定義 Firebase 配置
const config = {
    apiKey: "AIzaSyAkCEHAwG2pbPGbRXVPutzXD43FcmAG-7I",
    authDomain: "adventure-card-project.firebaseapp.com",
    projectId: "adventure-card-project",
    storageBucket: "adventure-card-project.appspot.com",
    messagingSenderId: "850675878938",
    appId: "1:850675878938:web:2436d974f2d0513e6ed5a3"
};

// 確保只初始化一次
if (typeof window.myFirebaseApp === 'undefined') {
    try {
        // 初始化 Firebase
        window.myFirebaseApp = firebase.initializeApp(config);
        
        // 初始化 Firestore
        window.db = firebase.firestore();
        
        // 初始化 Auth
        window.auth = firebase.auth();
        
        // 導出配置供其他檔案使用
        window.firebaseConfig = config;
        
        console.log('Firebase 初始化成功');
    } catch (error) {
        console.error('Firebase 初始化失敗:', error);
    }
}

// 導出常用函數
window.getFirestore = () => window.db;
window.getAuth = () => window.auth;

// 常用資料庫操作函數
window.getUserData = async (userId) => {
    try {
        const doc = await window.db.collection('users').doc(userId).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('獲取用戶資料失敗:', error);
        return null;
    }
};

// 職業相關函數
window.getUserClass = async (userId) => {
    try {
        const userData = await window.getUserData(userId);
        return userData ? userData.class : null;
    } catch (error) {
        console.error('獲取用戶職業失敗:', error);
        return null;
    }
};

window.updateUserClass = async (userId, classType) => {
    try {
        await window.updateUserData(userId, { class: classType });
        return true;
    } catch (error) {
        console.error('更新用戶職業失敗:', error);
        return false;
    }
};

window.updateUserData = async (userId, data) => {
    try {
        await window.db.collection('users').doc(userId).update(data);
        return true;
    } catch (error) {
        console.error('更新用戶資料失敗:', error);
        return false;
    }
};

window.getMissions = async () => {
    try {
        // 檢查用戶是否已登入
        const user = window.auth.currentUser;
        if (!user) {
            console.log('用戶未登入');
            return [];
        }

       // 獲取任務列表
window.getMissions = async function() {
    try {
        // 移除登入檢查
        const missionsRef = window.db.collection('missions');
        const snapshot = await missionsRef.get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting missions:', error);
        throw error;
    }
};

// 認證相關函數
window.getCurrentUser = () => {
    return window.auth.currentUser;
};

window.signIn = async (email, password) => {
    try {
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error('登入失敗:', error);
        throw error;
    }
};

window.signOut = async () => {
    try {
        await window.auth.signOut();
        return true;
    } catch (error) {
        console.error('登出失敗:', error);
        return false;
    }
};

// 錯誤處理函數
window.handleFirebaseError = (error) => {
    let errorMessage = '發生未知錯誤';
    
    switch (error.code) {
        case 'auth/user-not-found':
            errorMessage = '找不到該用戶';
            break;
        case 'auth/wrong-password':
            errorMessage = '密碼錯誤';
            break;
        case 'auth/email-already-in-use':
            errorMessage = '此電子郵件已被使用';
            break;
        case 'auth/weak-password':
            errorMessage = '密碼強度不足';
            break;
        case 'permission-denied':
            errorMessage = '權限不足';
            break;
        default:
            errorMessage = error.message;
    }
    
    console.error('Firebase 錯誤:', error);
    return errorMessage;
};

// 監聽認證狀態變化
window.auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('用戶已登入:', user.email);
        // 可以在這裡處理登入後的邏輯
    } else {
        console.log('用戶已登出');
        // 可以在這裡處理登出後的邏輯
    }
});
