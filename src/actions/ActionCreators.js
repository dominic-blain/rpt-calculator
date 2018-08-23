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

                dispatch(ActionCreators.getProgramStart(user.program.id));

                setTimeout(() => {
                    dispatch(ActionCreators.setIsLoading(false));
                }, loadTimeout);
            });
        }
    },
    getProgramStart(id) {
        return dispatch => {
            const database = store.firestore;
            const programRef = database.collection('programs').doc(id);

            programRef.get().then(result => {
                if (result.exists) {
                    const program = result.data();
                    dispatch(ActionCreators.getProgramSuccess(program));
                    dispatch(ActionCreators.getDaysStart(program.id));
                }
            }).catch(error => {
                // Manage error
                console.log(error);
                dispatch(ActionCreators.getProgramError());
            })
        }
    },
    getProgramSuccess(program) {
        return {
            type: type.GET_PROGRAM_SUCCESS,
            program: program
        }
    },
    getProgramError() {
        return {
            type: type.GET_PROGRAM_ERROR
        }
    },
    getDaysStart(programId) {
        return dispatch => {
            const database = store.firestore;
            const daysRef = database
                .collection('programs')
                .doc(programId)
                .collection('days');

            daysRef.get().then(results => {
                let days = [];
                results.docs.forEach(result => {
                    if (result.exists) {
                        const day = result.data();
                        days.push(day);
                        dispatch(ActionCreators.getExercisesStart(day.id, programId));
                    }
                });
                dispatch(ActionCreators.getDaysSuccess(days));
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.getDaysError(error));
            })
        }
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
    getExercisesStart(dayId, programId) {
        return dispatch => {
            const database = store.firestore;
            const exercisesRef = database
                .collection('programs')
                .doc(programId)
                .collection('days')
                .doc(dayId)
                .collection('exercises');

            exercisesRef.get().then(results => {
                let exercises = [];
                results.docs.forEach(result => {
                    if (result.exists) {
                        const exercise = result.data();
                        exercises.push(exercise);
                    }
                });
                dispatch(ActionCreators.getExercisesSuccess(exercises));
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.getExercisesError(error));
            })
        }
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
    }
};

export default ActionCreators;