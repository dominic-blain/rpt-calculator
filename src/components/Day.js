import React from 'react';
import { connect } from 'react-redux';
import Exercise from './Exercise/Exercise';

class Day extends React.Component {
    render() {
        const exercises = this.props.exercises;
        const activeExercise = this.props.activeExercise;
        const exercisesTemplate = [];
        exercises.forEach(exercise => {
            const isActive = activeExercise == exercise.id;
            exercisesTemplate.unshift(
                <Exercise 
                    key={exercise.id} 
                    data={exercise}
                    isActive={isActive} 
                />
            );
        });
        return (
            <div className="day">
                {exercisesTemplate}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        exercises: state.root.exercises.filter(exercise => exercise.dayId = props.data.id),
        activeExercise: state.root.ui.activeExercise
    })
};

export default connect(mapStateToProps)(Day);