import React from 'react';
import { connect } from 'react-redux';
import Exercise from '../Exercise/Exercise';

class ExercisesList extends React.Component {
    render() {
        const activeDayRef = this.props.activeDayRef;
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
            activeDay.exercises.forEach(exerciseId => {
                
                const exercise = exercises[exerciseId];
                // const isCompleted = exercise.isCompleted;
                // TODO: remove line below and uncomment line above
                const isCompleted = false;
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
                {exercisesTemplate}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        days: state.root.days,
        exercises: state.root.exercises,
        activeExerciseRef: state.root.ui.activeExercise
    })
};

export default connect(mapStateToProps)(ExercisesList);