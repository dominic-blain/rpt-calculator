import React from 'react';
import { connect } from 'react-redux';
import DayCard from '../DayCard/DayCard';

class DaysList extends React.Component {
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
                    name={name}
                    exercises={exercisesData}
                    isCompleted={isCompleted} data={day}
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

const mapStateToProps = (state, props) => {
    return ({
        days: state.root.days,
        exercises: state.root.exercises
    })
};

export default connect(mapStateToProps)(DaysList);