import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { firebase } from '../firebase';
import { reactReduxFirebase, firebaseReducer, getFirebase } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from 'redux-firestore'

import REACT_REDUX_FIREBASE from '../configs/reactReduxFirebase';
import rootReducer from "../reducers/rootReducer";
import thunk from 'redux-thunk';
import logger from '../middlewares/logger';

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