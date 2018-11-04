import * as type from '../constants/action-types';
import update from 'immutability-helper';

const initialState = {
    ui: {
        isLoading: true,
        activeView: 'Training',
        actviveDay: null,
        activeExercise: null,
        activeSet: 1,
        editingExercise: null
    },
    user: null,
    program: null,
    days: null,
    exercises: null
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_USER:
            return update (state, {
                user: {$set: action.id}
            });
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
        case type.SET_ACTIVE_VIEW:
            return update (state, {
                ui: {
                    activeView: {$set: action.view}
                }
            });
        case type.SET_ACTIVE_DAY:
            return update (state, {
                ui: {
                    activeDay: {$set: 
                        {
                            id: action.id,
                            order: action.order
                        }
                    }
                }
            });
        case type.SET_ACTIVE_EXERCISE:
            return update (state, {
                ui: {
                    activeExercise: {$set: 
                        {
                            id: action.id,
                            order: action.order
                        }
                    },
                    activeSet: {$set: 1}
                }
            });
        case type.SET_ACTIVE_SET:
            return update (state, {
                ui: {
                    activeSet: {$set: action.id}
                }
            });
        case type.SET_EDITING_EXERCISE:
            return update (state, {
                ui: {
                    editingExercise: {$set:
                        {
                            status: action.status,
                            id: action.id
                        }
                    }
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
            });
        case type.RESET_STATE:
            return update(state, {$set: initialState});
        default:
            return state;
    }
}

export default rootReducer;