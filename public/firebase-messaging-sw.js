importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');

const config = {
  apiKey: "AIzaSyAMDMI1yDOgCIQs60EX_5BF-KlW9fBk6IU",
  authDomain: "inproject-15e8f.firebaseapp.com",
  projectId: "inproject-15e8f",
  storageBucket: "inproject-15e8f.appspot.com",
  messagingSenderId: "271520764428",
  appId: "1:271520764428:web:3a2e98018f0b86a37d1429",
  measurementId: "G-HSDXQP9MQ2"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/firebase-logo.png'
  };
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});