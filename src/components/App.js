import React from 'react';
import ActionCreators from '../actions/ActionCreators';
import store from '../store/store';
import Program from './Program';
import Loading from './Loading/Loading';

class App extends React.Component {
    componentWillMount() {
        store.dispatch(ActionCreators.initApp());
    }

    render() {
        return (
            <main className="app">
                <Loading />
                <Program />
            </main>
            
        );
    }
}

export default App;