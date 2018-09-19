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

                dispatch(ActionCreators.getProgram(user.program.id))
                .then(() => {
                    setTimeout(() => {
                        dispatch(ActionCreators.setIsLoading(false));
                    }, loadTimeout);
                }).catch(error => {
                    // Manage error  
                });
            });
        }
    },
    getProgram(id) {
        return dispatch => {
            dispatch(ActionCreators.getProgramStart());
            const database = store.firestore;
            const programRef = database.collection('programs').doc(id);

            return programRef.get().then(result => {
                if (result.exists) {
                    const program = result.data();
                    dispatch(ActionCreators.getProgramSuccess(program));
                    return dispatch(ActionCreators.getDays(program.id));
                }
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.getProgramError(error));
            })
        }
    },
    getProgramStart() {
        return { type: type.GET_PROGRAM_START }
    },
    getProgramSuccess(program) {
        return {
            type: type.GET_PROGRAM_SUCCESS,
            program: program
        }
    },
    getProgramError(error) {
        return {
            type: type.GET_PROGRAM_ERROR,
            error: error
        }
    },
    getDays(programId) {
        return dispatch => {
            dispatch(ActionCreators.getDaysStart());
            const database = store.firestore;
            const daysRef = database
                .collection('programs')
                .doc(programId)
                .collection('days');

            return daysRef.get().then(results => {
                const days = [];
                const daysPromises = [];
                results.docs.forEach(result => {
                    if (result.exists) {
                        const day = result.data();
                        day['programId'] = programId;
                        days.push(day);
                        daysPromises.push(dispatch(ActionCreators.getExercises(day.id, programId)));
                    }
                });
                return Promise.all(daysPromises).then(() => {
                    dispatch(ActionCreators.getDaysSuccess(days));
                });
                
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.getDaysError(error));
            })
        }
    },
    getDaysStart() {
        return { type: type.GET_DAYS_START }
    },
    getDaysSuccess(days) {
        return {
            type: type.GET_DAYS_SUCCESS,
            days: days
        }
    },
    getDaysError(error) {
        return {
            type: type.GET_DAYS_ERROR,
            error: error
        }
    },
    getExercises(dayId, programId) {
        return dispatch => {
            dispatch(ActionCreators.getExercisesStart());
            const database = store.firestore;
            const exercisesRef = database
                .collection('programs')
                .doc(programId)
                .collection('days')
                .doc(dayId)
                .collection('exercises');

            return exercisesRef.get().then(results => {
                const exercises = {};
                const exercisesPromises = [];
                results.docs.forEach(result => {
                    if (result.exists) {
                        const exercise = result.data();
                        exercise['dayId'] = dayId;
                        exercisesPromises.push(
                            dispatch(ActionCreators.getGoalLog(exercise.id, dayId, programId))
                            .then(response => {
                                if (!!response) {
                                    const log = response.log;
                                    exercise['goalLog'] = log;
                                }
                                exercises[exercise.id] = exercise;
                            })
                        );
                    }
                });
                return Promise.all(exercisesPromises).then(() => {
                    dispatch(ActionCreators.getExercisesSuccess(exercises));
                });
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.getExercisesError(error));
            })
        }
    },
    getExercisesStart() {
        return { type: type.GET_EXERCISES_START }
    },
    getExercisesSuccess(exercises) {
        return {
            type: type.GET_EXERCISES_SUCCESS,
            exercises: exercises
        }
    },
    getExercisesError(error) {
        return {
            type: type.GET_EXERCISES_ERROR,
            error: error
        }
    },
    getGoalLog(exerciseId, dayId, programId) {
        return dispatch => {
            dispatch(ActionCreators.getGoalLogStart());
            const database = store.firestore;
            const logRef = database
                .collection('programs')
                .doc(programId)
                .collection('days')
                .doc(dayId)
                .collection('exercises')
                .doc(exerciseId)
                .collection('logs')
                .where('set', '==', 1)
                .orderBy('timestamp', 'desc')
                .limit(1);

            return logRef.get().then(results => {
                const result = results.docs[0];
                let log = {};
                if (result.exists) {
                    log = result.data();
                    return dispatch(ActionCreators.getGoalLogSuccess(log));
                }
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.getGoalLogError(error));
            })
        }
    },
    getGoalLogStart() {
        return { type: type.GET_GOAL_LOG_START }
    },
    getGoalLogSuccess(log) {
        return {
            type: type.GET_GOAL_LOG_SUCCESS,
            log: log
        }
    },
    getGoalLogError(error) {
        return {
            type: type.GET_GOAL_LOG_ERROR,
            error: error
        }
    },
    addDay(day) {
        return {
            type: type.ADD_DAY,
            day: day
        }
    },
    setIsLoading(value) {
        return {
            type: type.SET_IS_LOADING,
            value: value
        }
    },
    setActiveExercise(id) {
        return {
            type: type.SET_ACTIVE_EXERCISE,
            id: id
        }
    },
    setActiveSet(id) {
        return {
            type: type.SET_ACTIVE_SET,
            id: id
        }
    }
};

export default ActionCreators;