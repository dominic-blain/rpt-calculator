import React from 'react';
import { connect } from 'react-redux';
import DaysList from '../DaysList/DaysList';
import ExercisesList from '../ExercisesList/ExercisesList';
import ButtonSignOut from '../ButtonSignOut/ButtonSignOut';
import EmptyProgram from '../EmptyProgram/EmptyProgram';
import styles from './TrainingView.less';

class TrainingView extends React.Component {
    render() {
        const activeDayRef = this.props.activeDayRef;
        const days = this.props.days;
        const exercises = this.props.exercises;
        const hasProgram = days && exercises;
        const trainingViewClasses = styles.trainingView + ' ' +
            (!!activeDayRef ? styles.isExercises : styles.isDays);

        return (
            <div className={trainingViewClasses}>
                {hasProgram ? ( 
                    <div>
                        <div className={styles.daysListCtn}>
                            <DaysList 
                                days={days}
                                exercises={exercises}
                            />
                        </div>
                        <div className={styles.exercisesListCtn}>
                            <ExercisesList activeDayRef={activeDayRef} />
                        </div>
                        <div className={styles.signOutCtn}>
                            <ButtonSignOut />
                        </div>
                    </div>
                ) : (
                    <EmptyProgram />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return ({
        activeDayRef: state.root.ui.activeDay,
        days: state.root.days,
        exercises: state.root.exercises
    })
};

export default connect(mapStateToProps)(TrainingView);