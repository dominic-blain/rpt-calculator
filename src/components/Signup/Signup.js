import React from 'react';
import StyleFirebaseAUth from 'react-firebaseui/StyledFirebaseAuth';
import FIREBASEUI_CONFIG from '../../configs/firebaseui';
import { auth } from '../../firebase';

class Signup extends React.Component {
    render() {
        return (
            <StyleFirebaseAUth
                uiConfig={FIREBASEUI_CONFIG}
                firebaseAuth={auth}
            />
        )
    }
}

export default Signup;