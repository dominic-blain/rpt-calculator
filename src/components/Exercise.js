import React from 'react';
import { connect } from 'react-redux';
// import Day from './Day';

class Exercise extends React.Component {
    render() {
        const data = this.props.data;
        const name = data.name;
        const sets = data.sets;
        // const reps = data.reps;
        // const weight = data.weight;
        return (
            <section className="exercise">
                <h2 className="exercise-name">{name}</h2>
                <div className="exercise-card-ctn">
                    <div className="exercise-card">
                        <div className="exercise-card--details">
                            <span className="exercise-card--sets">
                                {`${sets} sets`}
                            </span>
                            <span className="exercise-card--goal">
                                {/* {`${reps} × ${weight} lbs`} */}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        // exercises: state.root.exercises.filter(exercise => exercise.dayId = props.data.id)
    })
};

export default connect(mapStateToProps)(Exercise);