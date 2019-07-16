import * as type from '../constants/action-types';
import { auth } from '../firebase';
import store from '../store/store';
import { types } from 'util';

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

                // User exists
                if (user) {
                    // Program exists
                    if (!!user.program) {
                        dispatch(ActionCreators.getProgram(user.program.id))
                        .then(() => {
                            setTimeout(() => {
                                dispatch(ActionCreators.setIsLoading(false));
                            }, loadTimeout);
                        }).catch(error => {
                            dispatch(ActionCreators.setErrorMessage('Error:' + error));
                        });
                    // Program DOES NOT exist
                    } else {
                        const programRef = database.collection('programs').doc();
                        const programId = programRef.id;
                        database.collection('programs').doc(programId).set({
                            id: programId,
                            userId: user.id
                        });
                        database.collection('users').doc(user.id).update({
                            program: programRef
                        })
                        .then(() => {
                            setTimeout(() => {
                                dispatch(ActionCreators.setIsLoading(false));
                            }, loadTimeout);
                        })
                    }
                }
                // User does NOT exist
                else {
                    dispatch(ActionCreators.createUser(id))
                    .then(() => {
                        setTimeout(() => {
                            dispatch(ActionCreators.setIsLoading(false));
                        }, loadTimeout);
                    });
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
            const programRef = database.collection('programs').doc();
            const programId = programRef.id;
            database.collection('programs').doc(programId).set({
                id: programId,
                userId: id
            });
            return database.collection('users').doc(id).set({
                id: id,
                program: programRef
            })
            .then(() => {
                return dispatch(ActionCreators.createUserSuccess());
            })
            .catch((error) => {
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
                return dispatch(ActionCreators.createUserError());
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
    createExercise(exercise, dayId) {
        return (dispatch, getState) => {
            const programId = getState().root.program.id;
            
            // Await last day id
            new Promise(resolve => {
                if (dayId === null) {
                    // New day if it does not exist
                    dispatch(ActionCreators.createDay(programId)).then(result => {
                        resolve(result);
                    })
                } else {
                    // Current day if it exists
                    return resolve(dayId);   
                }
            }).then(lastDayId => {
                const database = store.firestore;
                const state = getState();
                const days = state.root.days;
                // Add exercise to it
                const lastDay = days.find(day => {
                    return day.id == lastDayId;
                });
                const exerciseOrder = lastDay.exercises.length;
                const exerciseRef = database
                    .collection('programs').doc(programId)
                    .collection('days').doc(lastDayId)
                    .collection('exercises').doc();
                const newExercise = {
                    id: exerciseRef.id,
                    dayId: lastDayId,
                    order: exerciseOrder,
                    rest: parseFloat(exercise.rest),
                    breakdown: parseFloat(exercise.breakdown),
                    goal: parseInt(exercise.goal),
                    name: exercise.name,
                    sets: parseInt(exercise.sets),
                    reps: parseInt(exercise.reps),
                    weight: parseInt(exercise.weight),
                    strategy: exercise.strategy
                }

                // Get sets data
                dispatch(ActionCreators.getSetsByStrat(exercise.strategy, newExercise, lastDayId, programId))
                .then(response => {
                    newExercise['setsData'] = response;
                    // Save exercise to database
                    dispatch(ActionCreators.saveExercise(programId, lastDayId, newExercise));
                    // Add exercise to state
                    dispatch(ActionCreators.addExercise(newExercise));
                    // Add exercise ID to last day
                    dispatch(ActionCreators.addExerciseToDay(lastDay.order, newExercise.id));
                    // Back to days list
                    dispatch(ActionCreators.clearEditingExercise());
                });
            });
        }
    },
    editExercise(exercise) {
        return (dispatch, getState) => {
            const state = getState();
            const programId = state.root.program.id;

            const editedExercise = {
                id: exercise.id,
                dayId: exercise.dayId,
                order: parseInt(exercise.order),
                rest: parseFloat(exercise.rest),
                breakdown: parseFloat(exercise.breakdown),
                goal: parseInt(exercise.goal),
                name: exercise.name,
                sets: parseInt(exercise.sets),
                reps: parseInt(exercise.reps),
                weight: parseInt(exercise.weight),
                strategy: exercise.strategy
            }

            // Get sets data
            dispatch(ActionCreators.getSetsByStrat(exercise.strategy, editedExercise, exercise.dayId, programId))
            .then(response => {
                editedExercise['setsData'] = response;
                // Save exercise to database
                dispatch(ActionCreators.saveExercise(programId, exercise.dayId, editedExercise));
                // Update exercise in state
                dispatch(ActionCreators.updateExercise(editedExercise));
                // Back to days list
                dispatch(ActionCreators.clearEditingExercise());
            });
        }
    },
    updateExercise(exercise) {
        return {
            type: type.UPDATE_EXERCISE,
            exercise: exercise
        }
    },
    reorderExercise(source, target) {
        return dispatch => {
            if (source.dayId === target.dayId) {
                const spliceArray = [
                    [source.order, 1], 
                    [target.order, 0, source.id]
                ];

                dispatch(ActionCreators.reorderExercisesInDay(source.dayOrder, spliceArray));
            }
        }
    },
    confirmExerciseReorder() {
        return (dispatch, getState) => {
            dispatch(ActionCreators.confirmExerciseReorderStart());
            const database = store.firestore;
            const batch = database.batch();
            const state = getState();
            const programId = state.root.program.id;
            const days = state.root.days;
            const exercises = state.root.exercises;

            days.forEach(day => {
                const exerciseList = day.exercises;
                exerciseList.forEach((exerciseId, index) => {
                    const exercise = exercises[exerciseId];
                    const exerciseRef = database
                        .collection('programs')
                        .doc(programId)
                        .collection('days')
                        .doc(day.id)
                        .collection('exercises')
                        .doc(exerciseId);

                    exercise.order = index;
                    dispatch(ActionCreators.updateExercise(exercise));
                    batch.set(exerciseRef, exercise);
                });
            });

            batch.commit().then(() => {
                dispatch(ActionCreators.confirmExerciseReorderSuccess());
            }).catch((error) => {
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
                dispatch(ActionCreators.confirmExerciseReorderError(error));
            });
        }
    },
    confirmExerciseReorderStart() {
        return { type: type.CONFIRM_EXERCISE_REORDER_START }
    },
    confirmExerciseReorderSuccess() {
        return { type: type.CONFIRM_EXERCISE_REORDER_SUCCESS }
    },
    confirmExerciseReorderError(error) {
        return {
            type: type.CONFIRM_EXERCISE_REORDER_ERROR,
            error: error
        }
    },
    removeExercise(dayId, id) {
        return (dispatch, getState) => {
            const state = getState();
            const days = state.root.days;
            const exercises = state.root.exercises;
            const day = days.find(d => {
                return d.id === dayId;
            });
            const exercise = exercises[id];
            // Remove day if empty
            if (day.exercises.length <= 1) {
                dispatch(ActionCreators.removeDay(day.id, day.order));
            }
            // Otherwise, remove exercise from day
            else {
                dispatch(ActionCreators.removeExerciseFromDay(day.order, exercise.order));
            }
            // Remove exercise from list and delete from db
            dispatch(ActionCreators.removeExerciseFromList(id));
            dispatch(ActionCreators.deleteExercise(dayId, id));
        }
    },
    removeExerciseFromDay(dayOrder, exerciseOrder) {
        return {
            type: type.REMOVE_EXERCISE_FROM_DAY,
            dayOrder: dayOrder,
            exerciseOrder: exerciseOrder
        }
    },
    removeExerciseFromList(id) {
        return {
            type: type.REMOVE_EXERCISE_FROM_LIST,
            id: id
        }
    },
    deleteExercise(dayId, id) {
        return (dispatch, getState) => {
            dispatch(ActionCreators.deleteExerciseStart());
            const database = store.firestore;
            const programId = getState().root.program.id;
            
            return database
                .collection('programs')
                .doc(programId)
                .collection('days')
                .doc(dayId)
                .collection('exercises')
                .doc(id)
                .delete().then(() => {
                    return dispatch(ActionCreators.deleteExerciseSuccess());
                }).catch(error => {
                    dispatch(ActionCreators.setErrorMessage('Error:' + error));
                    return dispatch(ActionCreators.deleteExerciseError(error));
                });
        }
    },
    deleteExerciseStart() {
        return { type: type.DELETE_EXERCISE_START }
    },
    deleteExerciseSuccess() {
        return { type: type.DELETE_EXERCISE_SUCCESS }
    },
    deleteExerciseError(error) {
        return {
            type: type.DELETE_EXERCISE_ERROR,
            error: error
        }
    },
    removeDay(id, order) {
        return (dispatch, getState) => {
            const state = getState();
            const day = state.root.days[order];
            
            // Remove day from day, list and delete from db
            dispatch(ActionCreators.removeDayFromList(order));
            dispatch(ActionCreators.deleteDay(id));
        }
    },
    removeDayFromList(order) {
        return {
            type: type.REMOVE_DAY_FROM_LIST,
            order: order
        }
    },
    deleteDay(id) {
        return (dispatch, getState) => {
            dispatch(ActionCreators.deleteDayStart());
            const database = store.firestore;
            const programId = getState().root.program.id;
            
            return database
                .collection('programs')
                .doc(programId)
                .collection('days')
                .doc(id)
                .delete().then(() => {
                    return dispatch(ActionCreators.deleteDaySuccess());
                }).catch(error => {
                    dispatch(ActionCreators.setErrorMessage('Error:' + error));
                    return dispatch(ActionCreators.deleteDayError(error));
                });
        }
    },
    deleteDayStart() {
        return { type: type.DELETE_DAY_START }
    },
    deleteDaySuccess() {
        return { type: type.DELETE_DAY_SUCCESS }
    },
    deleteDayError(error) {
        return {
            type: type.DELETE_DAY_ERROR,
            error: error
        }
    },
    createDay(programId) {
        return (dispatch, getState) => {
            const database = store.firestore;
            const state = getState();
            const days = state.root.days;
            const dayRef = database
                .collection('programs').doc(programId)
                .collection('days').doc();
            const day = {
                id: dayRef.id,
                isCompleted: false,
                order: days.length,
                exercises: []
            }
            const awaitOperations = [
                dispatch(ActionCreators.addDay(day)),
                dispatch(ActionCreators.saveDay(programId, day))
            ];
            return Promise.all(awaitOperations).then(() => {
                return Promise.resolve(dayRef.id);
            });
        }
    },
    saveDay(programId, day) {
        return dispatch => {
            dispatch(ActionCreators.saveDayStart());
            const database = store.firestore;
            return database
                .collection('programs').doc(programId)
                .collection('days').doc(day.id)
                .set({
                    id: day.id,
                    isCompleted: day.isCompleted,
                    order: day.order
                })
            .then(() => {
                return dispatch(ActionCreators.saveDaySuccess());
            })
            .catch(error => {
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
                return dispatch(ActionCreators.saveDayError(error));
            });
        }
    },
    saveDayStart() {
        return { type: type.SAVE_DAY_START }
    },
    saveDaySuccess() {
        return { type: type.SAVE_DAY_SUCCESS }
    },
    saveDayError(error) {
        return {
            type: type.SAVE_DAY_ERROR,
            error: error
        }
    },
    saveExercise(programId, dayId, exercise) {
        return dispatch => {
            dispatch(ActionCreators.saveExerciseStart());
            const database = store.firestore;
            database
                .collection('programs').doc(programId)
                .collection('days').doc(dayId)
                .collection('exercises').doc(exercise.id)
                .set(exercise)
            .then(() => {
                dispatch(ActionCreators.saveExerciseSuccess());
            })
            .catch(error => {
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
                dispatch(ActionCreators.saveExerciseError(error));
            });
        }
    },
    saveExerciseStart() {
        return { type: type.SAVE_EXERCISE_START }
    },
    saveExerciseSuccess() {
        return { type: type.SAVE_EXERCISE_SUCCESS }
    },
    saveExerciseError(error) {
        return {
            type: type.SAVE_EXERCISE_ERROR,
            error: error
        }
    },
    addExerciseToDay(dayOrder, exerciseId) {
        return {
            type: type.ADD_EXERCISE_TO_DAY,
            dayOrder: dayOrder,
            exerciseId: exerciseId
        }
    },
    reorderExercisesInDay(dayOrder, spliceArray){
        return {
            type: type.REORDER_EXERCISES_IN_DAY,
            dayOrder: dayOrder,
            spliceArray: spliceArray
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
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
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
                .collection('days')
                .orderBy('order', 'desc');

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
                                    const exercise = exercises[exerciseId];
                                    day.exercises[exercise.order] = exerciseId;
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
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
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
                            dispatch(ActionCreators.getSetsByStrat(exercise.strategy, exercise, dayId, programId))
                            .then(response => {
                                exercise['setsData'] = response;
                                exercises[exercise.id] = exercise;
                            })
                        );
                    }
                });
                return Promise.all(exercisesPromises).then(() => {
                    return dispatch(ActionCreators.getExercisesSuccess(exercises));
                }).catch(error => {
                    // Manage error
                    dispatch(ActionCreators.setErrorMessage('Error:' + error));
                    dispatch(ActionCreators.getExercisesError(error));
                });
            }).catch(error => {
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
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
                let log;
                if (!results.empty) {
                    const result = results.docs[0];
                    if (result.exists) {
                        log = result.data();
                    }
                }
                return dispatch(ActionCreators.getLastLogSuccess(log));
            }).catch(error => {
                // Manage error
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
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
    
                        if (!!response.log) {
                            const log = response.log;
                            const startingWeight = (log.reps >= exercise.goal) ? log.weight + 5 : log.weight;
                            const breakdownWeight = Math.max(Math.round(startingWeight * exercise.breakdown / 5) * 5, 5);
                            for (let i = 0; i < setCount; i++) {
                                const setWeight = Math.max(startingWeight - (breakdownWeight * i), 0);
                                sets[i] = {
                                    reps: exercise.goal,
                                    weight: setWeight
                                };
                            }
                        }
                        else {
                            for (let i = 0; i < setCount; i++) {
                                sets[i] = {
                                    reps: exercise.goal,
                                    weight: 0
                                };
                            }
                        }

                        return Promise.resolve(sets);
                    });
                case 'linear':
                    const sets = [];
                    for (let i = 0; i < exercise.sets; i++) {
                        sets[i] = {
                            reps: exercise.reps,
                            weight: exercise.weight
                        };
                    }
                    return Promise.resolve(sets);
            }
        }
    },
    addDay(day) {
        return {
            type: type.ADD_DAY,
            day: day
        }
    },
    addExercise(exercise) {
        return {
            type: type.ADD_EXERCISE,
            exercise: exercise
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

    setActiveSet(exerciseId, setOrder) {
        return {
            type: type.SET_ACTIVE_SET,
            exerciseId: exerciseId,
            setOrder: setOrder
        }
    },
    setDayProgress(dayOrder) {
        return (dispatch, getState) => {
            const state = getState();
            const exercisesIds = state.root.days[dayOrder].exercises;
            const progress = {};

            exercisesIds.forEach(exerciseId => {
                const exercise = state.root.exercises[exerciseId];
                const sets = [];

                for (let i = 0; i < exercise.sets; i++) {
                    sets.push({
                        isResting: false,
                        isCompleted: false
                    });
                }

                progress[exerciseId] = {
                    sets: sets,
                    activeSet: 1
                };
            });
            dispatch(ActionCreators.setProgress(progress));
        }
    },
    setProgress(progress) {
        return {
            type: type.SET_PROGRESS,
            progress: progress
        }
    },
    updateSetProgress(exerciseId, setOrder, progress) {
        return {
            type: type.UPDATE_SET_PROGRESS,
            exerciseId: exerciseId,
            setOrder: setOrder,
            progress: progress
        }
    },
    setEditingExercise(status, id, dayId) {
        return {
            type: type.SET_EDITING_EXERCISE,
            status: status,
            id: id,
            dayId: dayId
        }
    },
    clearActiveDay() {
        return {
            type: type.CLEAR_ACTIVE_DAY
        }
    },
    clearActiveExercise() {
        return {
            type: type.CLEAR_ACTIVE_EXERCISE
        }
    },
    clearEditingExercise() {
        return {
            type: type.CLEAR_EDITING_EXERCISE
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
    setWeight(exerciseId, set, weight) {
        return {
            type: type.SET_WEIGHT,
            exerciseId: exerciseId,
            set: set,
            weight: weight
        }
    },
    completeDay(dayId) {
        return dispatch => {
            // TODO
        }
    },
    setExerciseComplete(id, isCompleted) {
        return {
            type: type.SET_EXERCISE_COMPLETE,
            id: id,
            isCompleted: isCompleted
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

            dispatch(ActionCreators.setExerciseComplete(id, true));

            batch.commit().then(() => {
                dispatch(ActionCreators.logExerciseSuccess(id));
            }).catch((error) => {
                dispatch(ActionCreators.setErrorMessage('Error:' + error));
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
    },
    setErrorMessage(message) {
        return {
            type: type.SET_ERROR_MSG,
            message: message
        }
    }
};

export default ActionCreators;