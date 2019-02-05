import * as type from '../constants/action-types';
import update from 'immutability-helper';

const initialState = {
    ui: {
        isLoading: true,
        activeView: "Workout",
        actviveDay: null,
        activeExercise: null,
        activeSet: 1,
        editingExercise: null
    },
    completedExercises: {},
    user: null,
    program: null,
    days: [],
    exercises: {}
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
        case type.UPDATE_EXERCISE:
            return update (state, {
                exercises: {
                    [action.exercise.id]: {$merge: action.exercise}
                }
            });
        case type.ADD_DAY:
            return update(state, {
                days: {$push: [action.day]}
            });
        case type.ADD_EXERCISE:
            return update(state, {
                exercises: {
                    [action.exercise.id]: {
                        $set: action.exercise
                    }
                }
            });
        case type.ADD_EXERCISE_TO_DAY:
            return update(state, {
                days: {
                    [action.dayOrder]: {
                        exercises: {
                            $push: [action.exerciseId]
                        }
                    }
                } 
            });
        case type.REORDER_EXERCISES_IN_DAY:
            return update(state, {
                days: {
                    [action.dayOrder]: {
                        exercises: {
                            $splice: action.spliceArray
                        }
                    }
                }
            });
        case type.REMOVE_EXERCISE_FROM_DAY:
            return update(state, {
                days: {
                    [action.dayOrder]: {
                        exercises: {
                            $splice: [[action.exerciseOrder, 1]]
                        }
                    }
                }
            });
        case type.REMOVE_EXERCISE_FROM_LIST:
            return update(state, {
                exercises: {
                    $unset: [action.id]
                }
            });
        case type.REMOVE_DAY_FROM_LIST:
            return update(state, {
                days: {
                    $splice: [[action.order, 1]]
                }
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
                            id: action.id,
                            dayId: action.dayId
                        }
                    }
                }
            });
        case type.CLEAR_ACTIVE_DAY:
            return update (state, {
                ui: {
                    activeDay: {$set: null}
                }
            });
        case type.CLEAR_ACTIVE_EXERCISE:
            return update (state, {
                ui: {
                    activeExercise: {$set: null}
                }
            });
        case type.CLEAR_EDITING_EXERCISE:
            return update (state, {
                ui: {
                    editingExercise: {$set: null}
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
        case type.SET_EXERCISE_COMPLETE:
            return update(state, {
                completedExercises: {
                    [action.id]: {$set: action.isCompleted}
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