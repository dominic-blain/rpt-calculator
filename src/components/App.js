import React from 'react';
import ActionCreators from '../actions/ActionCreators';
import store from '../store/store.js';
import Program from './Program';

class App extends React.Component {
    componentWillMount() {
        store.dispatch(ActionCreators.initApp());
    }

    render() {
        return (
            <Program />
        );
    }
}

export default App;