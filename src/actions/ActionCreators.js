import * as type from '../constants/action-types';
import store from '../store/store';

const ActionCreators = {
    initApp() {
        return (dispatch, getState) => {
            const database = store.firestore;
            const state = getState();
            const userRef = database.collection('users').doc(state.root.user);
            const loadStart = Date.now() / 1000;
            
            userRef.get().then(result => {
                const loadEnd = Date.now() / 1000;
                const loadDuration = loadEnd - loadStart;
                const loadMin = 1000;
                const loadTimeout = Math.max(0, loadMin - loadDuration);
                const user = result.data();

                user.programId.get().then(result => {
                    if (result.exists) {
                        const program = result.data();
                        dispatch(ActionCreators.setCurrentProgram(program.id));
                    }
                    else {
                        // manage error
                        console.log('You don\'t have a program yet');
                    }
                }).catch(error => {
                    console.log('Error: ', error);
                });
                setTimeout(() => {
                    dispatch(ActionCreators.setIsLoading(false));
                }, loadTimeout);
            });
        }
    },
    setCurrentProgram(id) {
        return {
            type: type.SET_CURRENT_PROGRAM,
            id: id
        }
    },
    setIsLoading(value) {
        return {
            type: type.SET_IS_LOADING,
            value: value
        }
    }
};

export default ActionCreators;