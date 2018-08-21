import * as type from '../constants/action-types';
import Database from '../database';
import { Action } from 'redux';

const ActionCreators = {
    initApp() {
        return dispatch => {
            var usersRef = Database.collection('users');
            var userQuery = usersRef.where("name.first", '==', 'Dominic');
            userQuery.get().then(results => {
                results.forEach(result => {
                    let user = result.data();
                    dispatch(ActionCreators.setCurrentUser(user));
                });
            })
            
           
        }
    },
    setCurrentUser(user) {
        return {
            type: type.SET_CURRENT_USER,
            user: user
        }
    }
};

export default ActionCreators;