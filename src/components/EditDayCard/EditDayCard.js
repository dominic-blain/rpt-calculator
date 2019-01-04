import React from 'react';
import EditExerciseCard from '../EditExerciseCard/EditExerciseCard';
import styles from './EditDayCard.less';
import update from 'immutability-helper';


class EditDayCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exercises: props.exercises
        }
        this.handleReorder = this.handleReorder.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.exercises !== prevProps.exercises) {
            this.setState(update(prevState, {
                exercises: {$set: this.props.exercises}
            }));
        }
    }

    handleReorder(sourceIndex, targetIndex) {
        const sourceExercise = this.state.exercises[sourceIndex];
        this.setState(update(this.state, {
            exercises: {
                $splice: [[sourceIndex, 1], [targetIndex, 0, sourceExercise]]
            }
        }));
    }

    render() {
        const id = this.props.id;
        const order = this.props.order;
        const name = this.props.name;
        const exercises = this.state.exercises;

        const exerciseTemplates = exercises.map((exercise, index) => {
            return (
                <EditExerciseCard
                    key={exercise.id}
                    id={exercise.id}
                    order={index}
                    name={exercise.name}
                    sets={exercise.sets}
                    onReorder={this.handleReorder}
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