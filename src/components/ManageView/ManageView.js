import React from 'react';
import { connect } from 'react-redux';
import CreateExercise from '../CreateExercise/CreateExercise';
import styles from './ManageView.less';
import ActionCreators from '../../actions/ActionCreators';

class ManageView extends React.Component {
    constructor(props) {
        super(props);
        this.handleCreateExercise = this.handleCreateExercise.bind(this);
        this.handleDone = this.handleDone.bind(this);
    }

    handleCreateExercise() {
        this.props.onCreateExerciseClick();
    }

    handleDone() {
        this.props.onDoneClick();
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
                    // editExerciseTemplate = <EditExercise />
                    break;
            }
        }
        
        if (days.lenght !== 0) {
            days.forEach((dayId, index) => {
                const day = days[index];
                let exercisesList = [];
                
                day.exercises.forEach(exerciseId => {
                    const exercise = exercises[exerciseId];
                    exercisesList.push(
                        <li>{exercise.name}</li>
                    );
                });

                editDaysTemplate.push(
                    <div>
                        <h2>Day</h2>
                        <ol>
                            {exercisesList}
                        </ol>
                    </div>
                );
            });
        }

        return (
          <div className={manageViewClasses}>
            <div className={styles.daysCtn}>
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
                        Done
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
    onDoneClick: () => dispatch(ActionCreators.setActiveView('Training'))
});

const mapStateToProps = state => ({
    days: state.root.days,
    exercises: state.root.exercises,
    editingExercise: state.root.ui.editingExercise
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageView);