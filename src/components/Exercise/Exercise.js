import React from 'react';
import { connect } from 'react-redux';
import styles from './Exercise.less';

class Exercise extends React.Component {
    render() {
        const data = this.props.data;
        const name = data.name;
        const sets = data.sets;
        const goalLog = data.goalLog;
        // const reps = data.reps;
        // const weight = data.weight;
        return (
            <section className={styles.exercise}>
                <h2 className={styles.name}>{name}</h2>
                <div className={styles.cardCtn}>
                    <div className={styles.card}>
                        <div className={styles.cardDetails}>
                            <span className={styles.cardSets}>
                                {`${sets} sets`}
                            </span>
                            <span className={styles.cardGoal}>
                                {`${goalLog.reps} × ${goalLog.weight} lbs`}
                            </span>
                        </div>
                        <button className={styles.buttonLogs}>
                        </button>
                        <button className={styles.buttonStart}>
                        </button>
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