import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import store from '../../store/store';
import { auth } from '../../firebase';
import TrainingView from '../TrainingView/TrainingView';
import ManageView from '../ManageView/ManageView';
import Loading from '../Loading/Loading';
import Navigation from '../Navigation/Navigation';
import Signup from '../Signup/Signup';
import styles from './App.less';
import TouchBackend from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';
import flow from 'lodash/flow';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserChange = this.handleUserChange.bind(this);
    }
    
    componentDidMount() {
        this.unregisterAuthObserver = auth.onAuthStateChanged(user => {
            this.handleUserChange(user);
        });
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    handleUserChange(user) {
        if (user) {
            this.props.onUserChange(user.uid);
        }
        else {
            store.dispatch(ActionCreators.resetState());
            store.dispatch(ActionCreators.setIsLoading(false));
        }   
    }

    render() {
        const activeView = this.props.activeView;
        const isLogged = this.props.isLogged;
        let viewTemplate = <Signup />;
        
        if (isLogged) {
            switch (activeView) {
                case 'Workout':
                    viewTemplate = <TrainingView />;
                    break;
                case 'Manage':
                    viewTemplate = <ManageView />;
                    break;
                default:
                    viewTemplate = <Signup />;
                    break;
            }
        }

        return (
            <main className={styles.app}>
                <Loading />
                {viewTemplate}
                
            </main>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onUserChange: id => {
        dispatch(ActionCreators.setUser(id));
        dispatch(ActionCreators.setIsLoading(true));
        dispatch(ActionCreators.loadUser(id));
    }
})

const mapStateToProps = state => ({
    userId: state.root.user,
    isLogged: !state.firebase.auth.isEmpty,
    activeView: state.root.ui.activeView
});

export default flow(
    connect(mapStateToProps, mapDispatchToProps),
    DragDropContext(TouchBackend)
)(App);