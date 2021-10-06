// import { initializeApp } from "@firebase/app";
// import { getMessaging } from "@firebase/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";

// const firebaseApp = initializeApp({
//     apiKey: 'AIzaSyC4Pcrp3Wfyqr7DisaRebKLW7TPnzsCVts',
//     authDomain: 'virtual-queues.firebaseapp.com',
//     databaseURL: 'https://virtual-queues.firebaseio.com',
//     projectId: 'virtual-queues',
//     storageBucket: 'virtual-queues.appspot.com',
//     messagingSenderId: '693345637899',
//     appId: "1:693345637899:web:5b6b2d22aaa2362979190e",
//     measurementId: "G-NGJV51HE6M"
// });

// const messaging = getMessaging(firebaseApp);
// onBackgroundMessage(messaging, (payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//       body: 'Background Message body.',
//       icon: '/logo192.png'
//     };
  
//     self.registration.showNotification(notificationTitle,
//       notificationOptions);
//   });