import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAMDMI1yDOgCIQs60EX_5BF-KlW9fBk6IU",
  authDomain: "inproject-15e8f.firebaseapp.com",
  projectId: "inproject-15e8f",
  storageBucket: "inproject-15e8f.appspot.com",
  messagingSenderId: "271520764428",
  appId: "1:271520764428:web:3a2e98018f0b86a37d1429",
  measurementId: "G-HSDXQP9MQ2"
};

firebase.initializeApp(firebaseConfig);

let messaging = null;
if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
}

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then((firebaseToken) => {
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });