import React from 'react';
import { connect } from 'react-redux';
import CreateDay from '../CreateDay/CreateDay';
import CreateExercise from '../CreateExercise/CreateExercise';
import styles from './ManageView.less';
import ActionCreators from '../../actions/ActionCreators';

class ManageView extends React.Component {
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

        console.log(editingExercise);

        return (
          <div className={manageViewClasses}>
            <div className={styles.daysCtn}>
                {editDaysTemplate}
                <CreateDay
                    onAddExercise={this.props.onAddExercise} />
            </div>
            <div className={styles.exerciseCtn}>
                {editExerciseTemplate}
            </div>
          </div>   
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onAddExercise: () => dispatch(ActionCreators.setEditingExercise('new', null))
})

const mapStateToProps = state => ({
    days: state.root.days,
    exercises: state.root.exercises,
    editingExercise: state.root.ui.editingExercise
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageView);