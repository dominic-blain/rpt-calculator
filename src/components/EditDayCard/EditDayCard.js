import React from 'react';
import styles from './EditDayCard.less';

class EditDayCard extends React.Component {
    render() {
        const id = this.props.id;
        const order = this.props.order;
        const name = this.props.name;
        const exercises = this.props.exercises;

        const exerciseTemplates = exercises.map(exercise => {
            return (
                <div key={exercise.id} className={styles.exercise}>
                    <div className={styles.exerciseName}>{exercise.name}</div>
                    <div className={styles.exerciseSets}>× {exercise.sets}</div>
                </div>
            )
        });

        
        return (
            <section className={styles.editDayCard}>
                <h2 className={styles.title}>{name}</h2>
                <div className={styles.exercisesCtn}>{exerciseTemplates}</div>
            </section>
        )
    }
}


export default EditDayCard;