import React from 'react';
import { connect } from 'react-redux';
import DaysList from '../DaysList/DaysList';
import styles from './TrainingView.less';

class TrainingView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayExercises: false
        }
    }

    render() {
        const activeDay = this.props.activeDay;
        const displayExercises = this.state.displayExercises;
        const trainingViewClasses = styles.trainingView + ' ' +
            (displayExercises ? styles.isExercises : styles.isDays);

        return (
            <div className={trainingViewClasses}>
                <div className={styles.daysListCtn}>
                    <DaysList />
                </div>
                <div className={styles.exercisesListCtn}>
                    {/* <ExercisesList dayId={activeDay} /> */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return ({
        activeDay: state.root.activeDay
    })
};

export default connect(mapStateToProps)(TrainingView);