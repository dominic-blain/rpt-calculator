import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import FIREBASE_CONFIG from '../configs/firebase';
import FIRESTORE_CONFIG from '../configs/firestore';

if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

const auth = firebase.auth();
const firestore = firebase.firestore();
firestore.settings(FIRESTORE_CONFIG);



export {
    auth,
    firestore,
    firebase
};