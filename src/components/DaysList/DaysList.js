import React from 'react';
import { connect } from 'react-redux';
import DayCard from '../DayCard/DayCard';
import ActionCreators from '../../actions/ActionCreators';

class DaysList extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
    }

    handleStartButtonClick(event) {
        const dayId = event.target.dataset.id;
        const dayOrder = event.target.dataset.order;
        const exerciseId = event.target.dataset.firstExerciseId;
        this.props.onStartButtonClick(dayId, dayOrder, exerciseId);
    }

    render() {
        const days = this.props.days;
        const exercises = this.props.exercises;

        const dayCardTemplates = [];
        days.forEach((day, index) => {
            const isCompleted = false;
            const name = 'Day ' + index;
            const exercisesData = day.exercises.map(exerciseId => {
                const exercise = exercises[exerciseId];
                return {
                    id: exercise.id,
                    name: exercise.name,
                    sets: exercise.sets
                }
            });
            dayCardTemplates.push(
                <DayCard 
                    key={day.id}
                    id={day.id}
                    order={day.order}
                    name={name}
                    exercises={exercisesData}
                    isCompleted={isCompleted}
                    onStartButtonClick={this.handleStartButtonClick}
                />
            );
        });
        return (
            <div className="daysList">
                {dayCardTemplates}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onStartButtonClick: (dayId, dayOrder, exerciseId) => {
        dispatch(ActionCreators.setActiveDay(dayId, dayOrder));
        dispatch(ActionCreators.setActiveExercise(exerciseId, 0));
    }
});


const mapStateToProps = (state, props) => ({
    days: state.root.days,
    exercises: state.root.exercises
});

export default connect(mapStateToProps, mapDispatchToProps)(DaysList);