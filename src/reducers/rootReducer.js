import * as type from '../constants/action-types';
import update from 'immutability-helper';

const initialState = {
    ui: {
        isLoading: true
    },
    user:  'KJwfM2YjnZmhwK4iaSBb',
    currentProgram: '',
    firestore: {
        data: {
            programs: {}
        }
    }
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_CURRENT_PROGRAM:
            return update(state, {
                currentProgram: {$set: action.id}
            });
        case type.SET_IS_LOADING:
            return update (state, {
                ui: {
                    isLoading: {$set: action.value}
                }
            })
        default:
            return state;
    }
}

export default rootReducer;