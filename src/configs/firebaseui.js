import { firebase } from '../firebase';

export const FIREBASEUI_CONFIG = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
};

export default FIREBASEUI_CONFIG;