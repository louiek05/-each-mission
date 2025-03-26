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
        console.log('開始初始化 Firebase...');
        window.myFirebaseApp = firebase.initializeApp(config);
        window.db = firebase.firestore();
        window.auth = firebase.auth();  // 添加 auth 實例
        console.log('Firebase 初始化成功');
    } catch (error) {
        console.error('Firebase 初始化失敗:', error);
    }
}

// 註冊新用戶
window.registerUser = async function(email, password, nickname, userClass) {
    try {
        console.log('開始註冊用戶...');
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // 創建用戶資料
        await window.db.collection('users').doc(user.uid).set({
            email: email,
            nickname: nickname,
            class: userClass,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            personality: '未設置',
            abilities: '未設置',
            description: '未設置'
        });
        
        console.log('用戶註冊成功');
        return user;
    } catch (error) {
        console.error('註冊失敗:', error);
        throw error;
    }
};

// 用戶登入
window.loginUser = async function(email, password) {
    try {
        console.log('開始登入...');
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        console.log('登入成功');
        return userCredential.user;
    } catch (error) {
        console.error('登入失敗:', error);
        throw error;
    }
};

// 用戶登出
window.logoutUser = async function() {
    try {
        await window.auth.signOut();
        console.log('登出成功');
    } catch (error) {
        console.error('登出失敗:', error);
        throw error;
    }
};

// 獲取當前用戶
window.getCurrentUser = function() {
    return window.auth.currentUser;
};

// 獲取任務列表
window.getMissions = async function() {
    try {
        console.log('開始獲取任務列表...');
        const missionsRef = window.db.collection('missions');
        const snapshot = await missionsRef.get();
        console.log('獲取到的任務數量:', snapshot.size);
        
        if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title || '未命名任務',
                description: doc.data().description || '無描述',
                reward: doc.data().reward || 0,
                publisher: doc.data().publisher || '未知',
                deadline: doc.data().deadline || '無限制',
                image: doc.data().image || 'path/to/default-mission-image.jpg',
                status: doc.data().status || '可接取',
                ...doc.data()
            }));
        } else {
            console.log('沒有找到任務');
            return [];
        }
    } catch (error) {
        console.error('獲取任務列表失敗:', error);
        return [];
    }
};

// 錯誤處理函數
window.handleFirebaseError = (error) => {
    let errorMessage = '發生未知錯誤';
    
    switch (error.code) {
        case 'permission-denied':
            errorMessage = '權限不足';
            break;
        case 'auth/email-already-in-use':
            errorMessage = '此電子郵件已被使用';
            break;
        case 'auth/invalid-email':
            errorMessage = '無效的電子郵件格式';
            break;
        case 'auth/weak-password':
            errorMessage = '密碼強度不足';
            break;
        case 'auth/user-not-found':
            errorMessage = '找不到此用戶';
            break;
        case 'auth/wrong-password':
            errorMessage = '密碼錯誤';
            break;
        default:
            errorMessage = error.message;
    }
    
    console.error('Firebase 錯誤:', error);
    return errorMessage;
};
