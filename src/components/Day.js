import React from 'react';
import { connect } from 'react-redux';
import Exercise from './Exercise/Exercise';

class Day extends React.Component {
    render() {
        const exercises = this.props.exercises;
        const activeExercise = this.props.activeExercise;
        const exercisesTemplate = [];
        for (const exerciseId in exercises) {
            const exercise = exercises[exerciseId];
            const isCompleted = exercise.isCompleted;
            const isActive = activeExercise == exercise.order && !isCompleted;
            exercisesTemplate.unshift(
                <Exercise 
                    key={exercise.id} 
                    data={exercise}
                    isActive={isActive}
                    isCompleted={isCompleted}
                />
            );
        }
        return (
            <div className="day">
                {exercisesTemplate}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        exercises: state.root.exercises,
        activeExercise: state.root.ui.activeExercise
    })
};

export default connect(mapStateToProps)(Day);