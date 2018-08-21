import firebase from 'firebase';
import FIREBASE_CONFIG from './configs/firebase';
import FIRESTORE_CONFIG from './configs/firestore';

firebase.initializeApp(FIREBASE_CONFIG);
var Database = firebase.firestore();
Database.settings(FIRESTORE_CONFIG)

export default Database;