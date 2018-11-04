import * as type from '../constants/action-types';
import { auth } from '../firebase';
import store from '../store/store';

const ActionCreators = {
    init() {
        return dispatch => {
            dispatch(ActionCreators.resetState());
        }
    },
    signOut() {
        return () => {
            auth.signOut();
        }
    },
    resetState() {
        return {type: type.RESET_STATE};
    },
    loadUser(id) {
        return dispatch => {
            const database = store.firestore;
            const userRef = database.collection('users').doc(id);
            const loadStart = Date.now() / 1000;
            
            userRef.get().then(result => {
                const loadEnd = Date.now() / 1000;
                const loadDuration = loadEnd - loadStart;
                const loadMin = 1000;
                const loadTimeout = Math.max(0, loadMin - loadDuration);
                const user = result.data();

                // User exists AND has program
                if (user && user.program !== null) {
                    dispatch(ActionCreators.getProgram(user.program.id))
                    .then(() => {
                        setTimeout(() => {
                            dispatch(ActionCreators.setIsLoading(false));
                        }, loadTimeout);
                    }).catch(error => {
                        // Manage error  
                    });
                }
                // User exists BUT no program
                else if (user) {
                    // Delete after test
                    dispatch(ActionCreators.setActiveView('Manage'));
                    setTimeout(() => {
                        dispatch(ActionCreators.setIsLoading(false));
                    }, loadTimeout);
                }
                // User does NOT exist
                else {
                    dispatch(ActionCreators.createUser(id));
                }
            });
        }
    },
    setUser(id) {
        return { 
            type: type.SET_USER,
            id: id
        }
    },
    createUser(id) {
        return dispatch => {
            dispatch(ActionCreators.createUserStart(id));
            const database = store.firestore;
            database.collection('users').doc(id).set({
                id: id,
                program: null
            })
            .then(() => {
                dispatch(ActionCreators.createUserSuccess());
            })
            .catch(() => {
                dispatch(ActionCreators.createUserError());
            })
        }
    },
    createUserStart(id) {
        return {
            type: type.CREATE_USER_START,
            id: id
        }
    },
    createUserSuccess() {
        return {
            type: type.CREATE_USER_SUCCESS
        }
    },
    createUserError(error) {
        return {
            type: type.CREATE_USER_ERROR,
            error: error
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
                        day.programId = programId;
                        day.exercises = [];
                        daysPromises.push(
                            dispatch(ActionCreators.getExercises(day.id, programId))
                            .then(response => {
                                const exercises = response.exercises;
                                for (let exerciseId in exercises) {
                                    day.exercises.unshift(exerciseId);
                                }
                                days.unshift(day);
                            })
                        );
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
                .collection('exercises')
                .orderBy('order', 'desc');

            return exercisesRef.get().then(results => {
                const exercises = {};
                const exercisesPromises = [];
                results.docs.forEach(result => {
                    if (result.exists) {
                        const exercise = result.data();
                        exercise['dayId'] = dayId;
                        exercisesPromises.push(
                            dispatch(ActionCreators.getSetsByStrat('rpt', exercise, dayId, programId))
                            .then(response => {
                                exercise['setsData'] = response;
                                exercises[exercise.id] = exercise;
                            })
                        );
                    }
                });
                return Promise.all(exercisesPromises).then(() => {
                    return dispatch(ActionCreators.getExercisesSuccess(exercises));
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
    getLastLog(exerciseId, dayId, programId) {
        return dispatch => {
            dispatch(ActionCreators.getLastLogStart());
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
                    return dispatch(ActionCreators.getLastLogSuccess(log));
                }
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.getLastLogError(error));
            })
        }
    },
    getLastLogStart() {
        return { type: type.GET_LAST_LOG_START }
    },
    getLastLogSuccess(log) {
        return {
            type: type.GET_LAST_LOG_SUCCESS,
            log: log
        }
    },
    getLastLogError(error) {
        return {
            type: type.GET_LAST_LOG_ERROR,
            error: error
        }
    },
    getSetsByStrat(strategy, exercise, dayId, programId) {
        return dispatch => {
            switch(strategy) {
                case 'rpt':
                    return dispatch(ActionCreators.getLastLog(exercise.id, dayId, programId))
                    .then(response => {
                        const sets = [];
                        const setCount = exercise.sets;
                        if (!!response) {
                            const log = response.log;
                            const startingWeight = (log.reps >= exercise.goal) ? log.weight + 5 : log.weight;
                            for (let i = 0; i < setCount; i++) {
                                const breakdownWeight = startingWeight * (1 - exercise.breakdown * i);
                                const roundedWeight = Math.floor(breakdownWeight /5) *5;
                                sets.push({
                                    reps: exercise.goal,
                                    weight: roundedWeight
                                });
                            }
                        }
                        else {
                            for (let i = 0; i < setCount; i++) {
                                sets.push({
                                    reps: exercise.goal,
                                    weight: 0
                                });
                            }
                        }

                        return Promise.resolve(sets);
                    });
            }
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
    setActiveView(view) {
        return {
            type: type.SET_ACTIVE_VIEW,
            view: view
        }
    },
    setActiveDay(id, order) {
        return {
            type: type.SET_ACTIVE_DAY,
            id: id,
            order: order
        }
    },
    setActiveExercise(id, order) {
        return {
            type: type.SET_ACTIVE_EXERCISE,
            id: id,
            order: order
        }
    },
    setActiveSet(id) {
        return {
            type: type.SET_ACTIVE_SET,
            id: id
        }
    },
    setEditingExercise(status, id) {
        return {
            type: type.SET_EDITING_EXERCISE,
            status: status,
            id: id
        }
    },
    setReps(exerciseId, set, reps) {
        return {
            type: type.SET_REPS,
            exerciseId: exerciseId,
            set: set,
            reps: reps
        }
    },
    logExercise(id, dayId, sets) {
        return (dispatch, getState) => {
            dispatch(ActionCreators.logExerciseStart());
            const database = store.firestore;
            const batch = database.batch();
            const state = getState();
            const programId = state.root.program.id;
            const exerciseRef = database.collection('programs').doc(programId)
                .collection('days').doc(dayId)
                .collection('exercises').doc(id);
            const logsRef = exerciseRef.collection('logs');

            sets.forEach((set, index) => {
                const logRef = logsRef.doc();
                batch.set(
                    logsRef.doc(logRef.id), {
                       reps: set.reps,
                       weight: set.weight,
                       set: index + 1,
                       timestamp: new Date()
                    }
                );
            });

            batch.update(exerciseRef, {
                isCompleted: true
            });

            batch.commit().then(() => {
                dispatch(ActionCreators.logExerciseSuccess(id));
            }).catch((error) => {
                dispatch(ActionCreators.logExerciseError(error));
            });
        }
    },
    logExerciseStart() {
        return {
            type: type.LOG_EXERCISE_START
        }
    },
    logExerciseSuccess(exerciseId) {
        return {
            type: type.LOG_EXERCISE_SUCCESS,
            exerciseId: exerciseId
        }
    },
    logExerciseError(error) {
        return {
            type: type.LOG_EXERCISE_ERROR,
            error: error
        }
    }
};

export default ActionCreators;