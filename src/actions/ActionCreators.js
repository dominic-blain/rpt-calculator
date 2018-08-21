import * as type from '../constants/action-types';
import Database from '../database';
import { Action } from 'redux';

const ActionCreators = {
    initApp() {
        return dispatch => {
            const loadStart = Date.now() / 1000;
            let usersRef = Database.collection('users');
            let userQuery = usersRef.where("name.first", '==', 'Dominic');
            userQuery.get().then(results => {
                results.forEach(result => {
                    const loadEnd = Date.now() / 1000;
                    const loadDuration = loadEnd - loadStart;
                    const loadMin = 1000;
                    const loadTimeout = Math.max(0, loadMin - loadDuration);
                    let user = result.data();
                    dispatch(ActionCreators.setCurrentUser(user));
                    setTimeout(() => {
                        dispatch(ActionCreators.setIsLoading(false));
                    }, loadTimeout);
                    
                });
            });
        }
    },
    setCurrentUser(user) {
        return {
            type: type.SET_CURRENT_USER,
            user: user
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