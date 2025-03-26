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
        console.log('Firebase 初始化成功');
    } catch (error) {
        console.error('Firebase 初始化失敗:', error);
    }
}

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
        return [];  // 發生錯誤時返回空陣列
    }
};

// 錯誤處理函數
window.handleFirebaseError = (error) => {
    let errorMessage = '發生未知錯誤';
    
    switch (error.code) {
        case 'permission-denied':
            errorMessage = '權限不足';
            break;
        default:
            errorMessage = error.message;
    }
    
    console.error('Firebase 錯誤:', error);
    return errorMessage;
};
