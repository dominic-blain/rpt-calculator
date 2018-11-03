import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import store from '../../store/store';
import { auth } from '../../firebase';
import TrainingView from '../TrainingView/TrainingView';
import ManageView from '../ManageView/ManageView';
import Loading from '../Loading/Loading';
import Signup from '../Signup/Signup';
import styles from './App.less';

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
        console.log('USER ID:', user.uid);
        if (user) {
            this.props.onUserChange(user.uid);
            store.dispatch(ActionCreators.setIsLoading(true));
            store.dispatch(ActionCreators.loadUser(user.uid));
        }
        else {
            store.dispatch(ActionCreators.resetState());
            store.dispatch(ActionCreators.setIsLoading(false));
        }   
    }

    render() {
        const activeView = this.props.activeView;
        let viewTemplate;
        
        switch (activeView) {
            case 'Training':
                viewTemplate = <TrainingView />;
                break;
            case 'Manage':
                viewTemplate = <ManageView />;
                break;
            default:
                viewTemplate = <Signup />;
                break;
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
    onUserChange: id => dispatch(ActionCreators.setUser(id))
})

const mapStateToProps = state => ({
    userId: state.root.user,
    activeView: state.root.ui.activeView
});

export default connect(mapStateToProps, mapDispatchToProps)(App);