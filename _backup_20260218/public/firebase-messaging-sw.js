importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Config from User
const firebaseConfig = {
  apiKey: "AIzaSyD66hw-IMbx2lI4e53gkD2cVTnpV50vUM4",
  authDomain: "myeongsimpush.firebaseapp.com",
  projectId: "myeongsimpush",
  storageBucket: "myeongsimpush.firebasestorage.app",
  messagingSenderId: "918998983122",
  appId: "1:918998983122:web:a473da62b4bf514b95680b"
};

try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신', payload);
    
    // Customize notification here
    const notificationTitle = payload.notification.title || 'Myeongsim';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png', // Ensure this exists
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
    });
} catch(e) {
    console.error('SW Init Error:', e);
}
