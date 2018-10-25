import * as type from '../constants/action-types';
import update from 'immutability-helper';

const initialState = {
    ui: {
        isLoading: true,
        actviveDay: null,
        activeExercise: 0,
        activeSet: 1
    },
    user:  'KJwfM2YjnZmhwK4iaSBb',
    program: {},
    days: [],
    exercises: {}
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
                exercises: {$merge: action.exercises}
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
        case type.SET_ACTIVE_DAY:
            return update (state, {
                ui: {
                    activeDay: {$set: action.id}
                }
            });
        case type.SET_ACTIVE_EXERCISE:
            return update (state, {
                ui: {
                    activeExercise: {$set: action.id},
                    activeSet: {$set: 1}
                }
            });
        case type.SET_ACTIVE_SET:
            return update (state, {
                ui: {
                    activeSet: {$set: action.id}
                }
            });
        case type.SET_REPS:
            return update (state, {
                exercises: {
                    [action.exerciseId]: {
                        setsData: {
                            [action.set]: {
                                reps: {$set: action.reps}
                            }    
                        }
                    }
                }
            });
        case type.LOG_EXERCISE_SUCCESS:
            return update(state, {
                exercises: {
                    [action.exerciseId]: {
                        isCompleted: {$set: true}
                    }
                }
            })
        default:
            return state;
    }
}

export default rootReducer;