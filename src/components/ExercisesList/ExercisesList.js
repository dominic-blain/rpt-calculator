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
            const activeExercise = this.props.activeExercise;
            
            activeDay.exercises.forEach(exerciseId => {
                const exercise = exercises[exerciseId];
                // const isCompleted = exercise.isCompleted;
                // TODO: remove line below and uncomment line above
                const isCompleted = false;
                const isActive = activeExercise == exercise.order && !isCompleted;
                exercisesTemplate.push(
                    <Exercise 
                        key={exercise.id} 
                        data={exercise}
                        isActive={isActive}
                        isCompleted={isCompleted}
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
        activeExercise: state.root.ui.activeExercise
    })
};

export default connect(mapStateToProps)(ExercisesList);