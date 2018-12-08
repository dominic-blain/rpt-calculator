import React from 'react';
import { connect } from 'react-redux';
import CreateExercise from '../CreateExercise/CreateExercise';
import styles from './ManageView.less';
import ActionCreators from '../../actions/ActionCreators';

class ManageView extends React.Component {
    constructor(props) {
        super(props);
        this.handleCreateExercise = this.handleCreateExercise.bind(this);
    }

    handleCreateExercise() {
        this.props.onCreateExerciseClick();
    }

    render() {
        const editingExercise = this.props.editingExercise;
        const days = this.props.days;
        const exercises = this.props.exercises;
        const hasProgram = days && exercises;
        const manageViewClasses = styles.manageView + ' ' +
            (!!editingExercise ? styles.isExercise : styles.isDays);

        let editDaysTemplate;
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
        
        if (days) {
            days.forEach(dayId => {
                // console.log(dayId);
                // Add day to template list
            });
        }

        console.log(days);

        return (
          <div className={manageViewClasses}>
            <div className={styles.daysCtn}>
                <div className={styles.daysList}>
                    {editDaysTemplate}
                </div>
                <div className={styles.buttonsCtn}>
                    <button onClick={this.handleCreateExercise}>Create Exercise</button>
                    <button>Save changes</button>
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
    onCreateExerciseClick: () => dispatch(ActionCreators.setEditingExercise('new', null))
})

const mapStateToProps = state => ({
    days: state.root.days,
    exercises: state.root.exercises,
    editingExercise: state.root.ui.editingExercise
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageView);