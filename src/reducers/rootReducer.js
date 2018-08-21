import * as type from '../constants/action-types';
import update from 'immutability-helper';

const initialState = {
    ui: {
        isLoading: true
    },
    currentUser: {},
    program: {},
    days: {},
    exercises: {}
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_CURRENT_USER:
            return update(state, {
                currentUser: {$set: action.user}
            });
        default:
            return state;
    }
}

export default rootReducer;