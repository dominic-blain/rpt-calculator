import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer, getFirebase } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import FIREBASE_CONFIG from '../configs/firebase';
import FIRESTORE_CONFIG from '../configs/firestore';
import REACT_REDUX_FIREBASE from '../configs/reactReduxFirebase';
import rootReducer from "../reducers/rootReducer";
import thunk from 'redux-thunk';
import logger from '../middlewares/logger';


firebase.initializeApp(FIREBASE_CONFIG);
const firestore = firebase.firestore();
firestore.settings(FIRESTORE_CONFIG);

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, REACT_REDUX_FIREBASE),
    reduxFirestore(firebase)
)(createStore);

const reducers = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    root: rootReducer
});

const store = createStoreWithFirebase(
    reducers, 
    applyMiddleware(
        thunk.withExtraArgument(getFirebase),
        logger
    )
);

export default store;