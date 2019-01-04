import React from 'react';
import { connect } from 'react-redux';
import CreateExercise from '../CreateExercise/CreateExercise';
import EditExercise from '../EditExercise/EditExercise';
import EditDayCard from '../EditDayCard/EditDayCard';
import styles from './ManageView.less';
import ActionCreators from '../../actions/ActionCreators';

class ManageView extends React.Component {
    constructor(props) {
        super(props);
        this.handleCreateExercise = this.handleCreateExercise.bind(this);
        this.handleEditExercise = this.handleEditExercise.bind(this);
        this.handleReorderExercise = this.handleReorderExercise.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    handleCreateExercise() {
        this.props.onCreateExerciseClick();
    }

    handleEditExercise(id) {
        this.props.onEditExerciseClick(id);
    }

    handleReorderExercise(source, target) {
        this.props.onReorderExercise(source, target);
    }

    handleDone() {
        this.props.onDoneClick();
    }

    handleBack() {
        this.props.onBackClick();
    }

    render() {
        const editingExercise = this.props.editingExercise;
        const days = this.props.days;
        const exercises = this.props.exercises;
        const hasProgram = days && exercises;
        const manageViewClasses = styles.manageView + ' ' +
            (!!editingExercise ? styles.isExercise : styles.isDays);

        let editDaysTemplate = [];
        let editExerciseTemplate;

        if (editingExercise && editingExercise.status) {
            switch(editingExercise.status) {
                case 'new':
                    editExerciseTemplate = <CreateExercise />
                    break;
                case 'edit':
                    const editExerciseData = exercises[editingExercise.id]
                    editExerciseTemplate = <EditExercise exercise={editExerciseData} />
                    break;
            }
        }
        
        if (days.lenght !== 0) {
            days.forEach((dayId, index) => {
                const day = days[index];
                const name = 'Day ' + index;
                const exercisesData = day.exercises.map(exerciseId => {
                    const exercise = exercises[exerciseId];
                    return {
                        id: exercise.id,
                        name: exercise.name,
                        sets: exercise.sets
                    }
                });

                editDaysTemplate.push(
                    <EditDayCard
                        key={day.id}
                        id={day.id}
                        order={day.order}
                        name={name}
                        exercises={exercisesData}
                        onExerciseReorder={this.handleReorderExercise}
                        onExerciseEdit={this.handleEditExercise}
                    />
                );
            });
        }

        return (
          <div className={manageViewClasses}>
            <div className={styles.daysCtn}>
                <nav className={styles.topNav}>
                    <button onClick={this.handleBack}>← Back</button>
                </nav>
                <div className={styles.daysList}>
                    {editDaysTemplate}
                </div>
                <div className={styles.buttonsCtn}>
                    <button
                        className={styles.buttonCreateExercise} 
                        onClick={this.handleCreateExercise}>
                        Create Exercise
                    </button>
                    <button 
                        className={styles.buttonDone}
                        onClick={this.handleDone}>
                        Save
                    </button>
                </div>
            </div>
            <div className={styles.exerciseCtn}>
                {editExerciseTemplate}
            </div>
          </div>   
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCreateExerciseClick: () => dispatch(ActionCreators.setEditingExercise('new', null)),
    onEditExerciseClick: (id) => dispatch(ActionCreators.setEditingExercise('edit', id)),
    onReorderExercise: (source, target) => dispatch(ActionCreators.reorderExercise(source, target)),
    onDoneClick: () => dispatch(ActionCreators.setActiveView('Workout')),
    onBackClick: () => dispatch(ActionCreators.setActiveView('Workout'))
});

const mapStateToProps = state => ({
    days: state.root.days,
    exercises: state.root.exercises,
    editingExercise: state.root.ui.editingExercise
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageView);