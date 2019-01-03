import React from 'react';
import EditExerciseCard from '../EditExerciseCard/EditExerciseCard';
import styles from './EditDayCard.less';


class EditDayCard extends React.Component {
    render() {
        const id = this.props.id;
        const order = this.props.order;
        const name = this.props.name;
        const exercises = this.props.exercises;

        const exerciseTemplates = exercises.map(exercise => {
            return (
                <EditExerciseCard
                    key={exercise.id}
                    id={exercise.id}
                    name={exercise.name}
                    sets={exercise.sets}
                />
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