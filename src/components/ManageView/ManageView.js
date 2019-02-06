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
        this.handleBack = this.handleBack.bind(this);
    }

    handleCreateExercise(dayId) {
        this.props.onCreateExerciseClick(dayId);
    }

    handleEditExercise(id) {
        this.props.onEditExerciseClick(id);
    }

    handleReorderExercise(source, target) {
        this.props.onReorderExercise(source, target);
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

        let createButtonTemplate;
        let editDaysTemplate = [];
        let editExerciseTemplate;

        if (editingExercise && editingExercise.status) {
            switch(editingExercise.status) {
                case 'new':
                    editExerciseTemplate = <CreateExercise dayId={editingExercise.dayId} />
                    break;
                case 'edit':
                    const editExerciseData = exercises[editingExercise.id]
                    editExerciseTemplate = <EditExercise exercise={editExerciseData} />
                    break;
            }
        }
        
        // Create Day cards
        if (days.length !== 0) {
            days.forEach((dayId, index) => {
                const day = days[index];
                const name = 'Day ' + (index + 1);
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
                        key={index}
                        id={day.id}
                        order={day.order}
                        name={name}
                        exercises={exercisesData}
                        onExerciseReorder={this.handleReorderExercise}
                        onExerciseEdit={this.handleEditExercise}
                        onExerciseCreate={this.handleCreateExercise}
                    />
                );
            });
        }
        // Add new day
        editDaysTemplate.push(
            <EditDayCard
                key={days.length}
                id={null}
                order={days.length}
                name={'Day ' +(days.length + 1)}
                onExerciseCreate={this.handleCreateExercise}
            />
        );
        
        

        return (
          <div className={manageViewClasses}>
            <div className={styles.daysCtn}>
                <div className={styles.daysList}>
                    <nav className={styles.topNav}>
                        <button onClick={this.handleBack}>← Back</button>
                    </nav>
                    {editDaysTemplate}
                </div>
               {createButtonTemplate}
            </div>
            <div className={styles.exerciseCtn}>
                {editExerciseTemplate}
            </div>
          </div>   
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCreateExerciseClick: (dayId) => dispatch(ActionCreators.setEditingExercise('new', null, dayId)),
    onEditExerciseClick: (id) => dispatch(ActionCreators.setEditingExercise('edit', id)),
    onReorderExercise: (source, target) => dispatch(ActionCreators.reorderExercise(source, target)),
    onBackClick: () => {
        dispatch(ActionCreators.setActiveView('Workout'));
        dispatch(ActionCreators.confirmExerciseReorder());
    }
});

const mapStateToProps = state => ({
    days: state.root.days,
    exercises: state.root.exercises,
    editingExercise: state.root.ui.editingExercise
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageView);