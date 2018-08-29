import * as type from '../constants/action-types';
import update from 'immutability-helper';

const initialState = {
    ui: {
        isLoading: true,
        activeExercise: '',
        activeSet: 1
    },
    user:  'KJwfM2YjnZmhwK4iaSBb',
    program: {},
    days: [],
    exercises: []
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case type.GET_PROGRAM_SUCCESS:
            return update (state, {
                program: {$set: action.program}
            });
        case type.GET_DAYS_SUCCESS:
            return update (state, {
                days: {$set: action.days}
            });
        case type.GET_EXERCISES_SUCCESS:
            return update (state, {
                exercises: {$set: action.exercises}
            });
        case type.ADD_DAY:
            return update(state, {
                days: {$push: [action.day]}
            });
        case type.SET_IS_LOADING:
            return update (state, {
                ui: {
                    isLoading: {$set: action.value}
                }
            });
        case type.SET_ACTIVE_EXERCISE:
            return update (state, {
                ui: {
                    activeExercise: {$set: action.id}
                }
            });
        default:
            return state;
    }
}

export default rootReducer;