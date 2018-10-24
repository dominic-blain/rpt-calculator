import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import store from '../../store/store';
import TrainingView from '../TrainingView/TrainingView';
import Loading from '../Loading/Loading';
import styles from './App.less';

class App extends React.Component {
    componentWillMount() {
        store.dispatch(ActionCreators.initApp());
    }

    render() {
        return (
            <main className={styles.app}>
                <Loading />
                <TrainingView />
            </main>
            
        );
    }
}

const mapStateToProps = state => ({
    programId: state.root.currentProgram
});

export default connect(mapStateToProps)(App);