import React from 'react';
import { connect } from 'react-redux';
import Exercise from './Exercise';

class Day extends React.Component {
    render() {
        const exercises = this.props.exercises;
        const exercisesTemplate = []
        exercises.forEach(exercise => {
            exercisesTemplate.push(<Exercise key={exercise.id} data={exercise} />)
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
        exercises: state.root.exercises.filter(exercise => exercise.dayId = props.data.id)
    })
};

export default connect(mapStateToProps)(Day);