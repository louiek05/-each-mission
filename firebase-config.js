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
if (!firebase.apps.length) {
    try {
        console.log('開始初始化 Firebase...');
        firebase.initializeApp(config);
        window.db = firebase.firestore();
        window.auth = firebase.auth();
        console.log('Firebase 初始化成功');
    } catch (error) {
        console.error('Firebase 初始化失敗:', error);
    }
}

// 發布新任務
window.createMission = async function(missionData) {
    try {
        console.log('開始創建任務...');
        const missionRef = await window.db.collection('missions').add({
            ...missionData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: '可接取'
        });
        console.log('任務創建成功，ID:', missionRef.id);
        return missionRef.id;
    } catch (error) {
        console.error('創建任務失敗:', error);
        throw error;
    }
};

// 獲取用戶發布的任務
window.getUserMissions = async function(userId) {
    try {
        console.log('開始獲取用戶任務...');
        const missionsRef = window.db.collection('missions').where('userId', '==', userId);
        const snapshot = await missionsRef.get();
        console.log('獲取到的用戶任務數量:', snapshot.size);
        
        if (!snapshot.empty) {
            const missions = [];
            for (const doc of snapshot.docs) {
                const missionData = doc.data();
                const missionId = doc.id;
                
                // 如果有接取者，獲取他們的用戶資料
                if (missionData.acceptedBy && Object.keys(missionData.acceptedBy).length > 0) {
                    const acceptedByData = {};
                    for (const [acceptedUserId, acceptedData] of Object.entries(missionData.acceptedBy)) {
                        try {
                            const userDoc = await window.db.collection('users').doc(acceptedUserId).get();
                            if (userDoc.exists) {
                                const userData = userDoc.data();
                                acceptedByData[acceptedUserId] = {
                                    ...acceptedData,
                                    nickname: userData.nickname || '未知用戶'
                                };
                            }
                        } catch (error) {
                            console.error('獲取用戶資料失敗:', error);
                            acceptedByData[acceptedUserId] = {
                                ...acceptedData,
                                nickname: '未知用戶'
                            };
                        }
                    }
                    missionData.acceptedBy = acceptedByData;
                }
                
                missions.push({
                    id: missionId,
                    ...missionData
                });
            }
            return missions;
        } else {
            console.log('沒有找到用戶任務');
            return [];
        }
    } catch (error) {
        console.error('獲取用戶任務失敗:', error);
        return [];
    }
};

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
            return snapshot.docs.map(doc => {
                const data = doc.data();
                const currentAcceptedCount = data.acceptedBy ? Object.keys(data.acceptedBy).length : 0;
                const maxAcceptedCount = data.maxAcceptedCount || 1;
                
                return {
                    id: doc.id,
                    title: data.title || '未命名任務',
                    description: data.description || '無描述',
                    reward: data.reward || 0,
                    publisher: data.publisher || '未知',
                    deadline: data.deadline || '無限制',
                    image: data.image || 'path/to/default-mission-image.jpg',
                    status: data.status || '可接取',
                    acceptedBy: data.acceptedBy || {},
                    maxAcceptedCount: maxAcceptedCount,
                    currentAcceptedCount: currentAcceptedCount,  // 添加當前接取人數
                    ...data
                };
            });
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
