import React from 'react';
import { connect } from 'react-redux';
import DayCard from '../DayCard/DayCard';
import ActionCreators from '../../actions/ActionCreators';
import styles from './DaysList.less';

class DaysList extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
        this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    }

    handleStartButtonClick(event) {
        const dayId = event.target.dataset.id;
        const dayOrder = event.target.dataset.order;
        const exerciseId = event.target.dataset.firstExerciseId;
        this.props.onStartButtonClick(dayId, dayOrder, exerciseId);
    }

    handleEditButtonClick() {
        this.props.onEditButtonClick();
    }

    render() {
        const days = this.props.days;
        const exercises = this.props.exercises;

        const dayCardTemplates = [];
        days.forEach((day, index) => {
            const isCompleted = false;
            const name = 'Day ' + (index + 1);
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
                <nav className={styles.topNav}>
                    <button onClick={this.handleEditButtonClick}>Edit</button>
                </nav>
                {dayCardTemplates}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onStartButtonClick: (dayId, dayOrder, exerciseId) => {
        dispatch(ActionCreators.setDayProgress(dayOrder));
        dispatch(ActionCreators.setActiveDay(dayId, dayOrder));
        dispatch(ActionCreators.setActiveExercise(exerciseId, 0));
    },
    onEditButtonClick: () => dispatch(ActionCreators.setActiveView("Manage"))
});


export default connect(null, mapDispatchToProps)(DaysList);