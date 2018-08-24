import React from 'react';
import { connect } from 'react-redux';
// import Day from './Day';

class Exercise extends React.Component {
    render() {
       const exerciseName = this.props.data.name;
        return (
            <div className="exercise">
                <h2 className="exercise-name">{exerciseName}</h2>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        // exercises: state.root.exercises.filter(exercise => exercise.dayId = props.data.id)
    })
};

export default connect(mapStateToProps)(Exercise);