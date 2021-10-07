import { initializeApp } from "@firebase/app";
import { getMessaging } from "@firebase/messaging";

const firebaseApp = initializeApp({
    apiKey: 'AIzaSyC4Pcrp3Wfyqr7DisaRebKLW7TPnzsCVts',
    authDomain: 'virtual-queues.firebaseapp.com',
    databaseURL: 'https://virtual-queues.firebaseio.com',
    projectId: 'virtual-queues',
    storageBucket: 'virtual-queues.appspot.com',
    messagingSenderId: '693345637899',
    appId: "1:693345637899:web:5b6b2d22aaa2362979190e",
    measurementId: "G-NGJV51HE6M"
});

const messaging = getMessaging(firebaseApp);