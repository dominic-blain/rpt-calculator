import React from 'react';
import EditExerciseCard from '../EditExerciseCard/EditExerciseCard';
import styles from './EditDayCard.less';


class EditDayCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleCreateExercise = this.handleCreateExercise.bind(this);
    }

    handleCreateExercise() {
        this.props.onExerciseCreate(this.props.id);
    }

    render() {
        const name = this.props.name;
        const exercises = this.props.exercises;
        const id = this.props.id;
        const order = this.props.order;
        let exerciseTemplates;

        if (!!exercises) {
            exerciseTemplates = exercises.map((exercise, index) => {
                return (
                    <EditExerciseCard
                        key={exercise.id}
                        id={exercise.id}
                        order={index}
                        name={exercise.name}
                        sets={exercise.sets}
                        dayId={id}
                        dayOrder={order}
                        onReorder={this.props.onExerciseReorder}
                        onEdit={this.props.onExerciseEdit}
                    />
                )
            });
        }
        
        return (
            <section className={styles.editDayCard}>
                <h2 className={styles.title}>{name}</h2>
                <div className={styles.exercisesCtn}>
                    {exerciseTemplates}
                </div>
                <button
                    className={styles.buttonCreateExercise} 
                    onClick={this.handleCreateExercise}>
                    Add exercise
                </button>
            </section>
        )
    }
}

export default EditDayCard;