import React from 'react';
import styles from './DayCard.less';

class DayCard extends React.Component {
    render() {
        const id = this.props.id;
        const order = this.props.order;
        const name = this.props.name;
        const exercises = this.props.exercises;
        const isCompleted = this.props.isCompleted;
        const onStartButtonClick = this.props.onStartButtonClick;

        const dayCardClasses = styles.dayCard + ' ' +
            (isCompleted ? styles.isCompleted : '');

        const exerciseTemplates = exercises.map(exercise => {
            return (
                <div key={exercise.id} className={styles.exercise}>
                    <div className={styles.exerciseName}>{exercise.name}</div>
                    <div className={styles.exerciseSets}>× {exercise.sets}</div>
                </div>
            )
        });

        
        return (
            <section className={dayCardClasses}>
                <h2 className={styles.title}>{name}</h2>
                <div className={styles.exercisesCtn}>{exerciseTemplates}</div>
                <button 
                    className={styles.startButton}
                    data-id={id}
                    data-order={order} 
                    onClick={onStartButtonClick}>
                    Start workout
                </button>
            </section>
        )
    }
}


export default DayCard;