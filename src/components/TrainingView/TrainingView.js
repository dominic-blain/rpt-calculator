import React from 'react';
import { connect } from 'react-redux';
import DaysList from '../DaysList/DaysList';
import ExercisesList from '../ExercisesList/ExercisesList';
import ButtonSignOut from '../ButtonSignOut/ButtonSignOut';
import styles from './TrainingView.less';

class TrainingView extends React.Component {
    render() {
        const activeDayRef = this.props.activeDayRef;
        const trainingViewClasses = styles.trainingView + ' ' +
            (!!activeDayRef ? styles.isExercises : styles.isDays);

        return (
            <div className={trainingViewClasses}>
                <div className={styles.daysListCtn}>
                    <DaysList />
                </div>
                <div className={styles.exercisesListCtn}>
                    <ExercisesList activeDayRef={activeDayRef} />
                </div>
                <div className={styles.signOutCtn}>
                    <ButtonSignOut />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return ({
        activeDayRef: state.root.ui.activeDay
    })
};

export default connect(mapStateToProps)(TrainingView);