import React from 'react';
import { connect } from 'react-redux';
import Exercise from '../Exercise/Exercise';
import styles from './ExercisesList.less';
import ActionCreators from '../../actions/ActionCreators';

class ExercisesList extends React.Component {
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
    }

    handleBack() {
        this.props.onBackClick();
    }

    handleEnd(event) {
        // const dayId = event.target.dataset.id;
        // this.props.onEndButtonClick(dayId);
        this.props.onBackClick();
    }

    render() {
        const activeDayRef = this.props.activeDayRef;
        const completedExercises = this.props.completedExercises;
        let dayId = 0;
        let dayOrder = 0;
        const exercisesTemplate = [];

        if (!!activeDayRef) {
            const activeDay = this.props.days[activeDayRef.order];
            const exercises = this.props.exercises;
            const activeExerciseRef = this.props.activeExerciseRef;
            const nextExerciseOrder = activeExerciseRef.order + 1;
            const nextExerciseId = activeDay.exercises[nextExerciseOrder];
            const nextExerciseRef = {
                id: nextExerciseId,
                order: nextExerciseOrder
            }
            dayId = activeDay.id;
            dayOrder = activeDay.order;
            activeDay.exercises.forEach(exerciseId => {
                
                const exercise = exercises[exerciseId];
                const isCompleted = completedExercises[exerciseId];
                const isActive = activeExerciseRef.id == exercise.id && !isCompleted;
                exercisesTemplate.push(
                    <Exercise 
                        key={exercise.id}
                        exercise={exercise}
                        isActive={isActive}
                        isCompleted={isCompleted}
                        exerciseCount={activeDay.exercises.length}
                        nextExerciseRef={nextExerciseRef}
                    />
                );
            });
        }
        return (
            <div className="exercisesList">
                <nav className={styles.topNav}>
                    <button onClick={this.handleBack}>← Back</button>
                </nav>
                {exercisesTemplate}
                <button 
                    className={styles.endButton}
                    data-day-id={dayId}
                    data-order={dayOrder}
                    onClick={this.handleEnd}>
                    Finish workout
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        days: state.root.days,
        exercises: state.root.exercises,
        activeExerciseRef: state.root.ui.activeExercise,
        completedExercises: state.root.completedExercises
    })
};

const mapDispatchToProps = dispatch => {
    return ({
        onBackClick: () => dispatch(ActionCreators.clearActiveDay()),
        onEndButtonClick: (dayId) => dispatch(ActionCreators.completeDay(dayId))
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ExercisesList);