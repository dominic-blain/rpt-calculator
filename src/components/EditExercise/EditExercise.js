import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './EditExercise.less';

class EditExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editedExercise: {
                name: `${props.exercise.name}`,
                strategy: `${props.exercise.strategy}`,
                goal: `${props.exercise.goal}`,
                sets: `${props.exercise.sets}`,
                breakdown: `${props.exercise.breakdown}`,
                order: `${props.exercise.order}`,
                dayId: `${props.exercise.dayId}`,
                id: `${props.exercise.id}`
            },
            messages: {
                incomplete: 'Please fill all data'
            },
            isIncomplete: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleBack() {
        this.props.onBackClick();
    }

    handleDelete() {
        const id = this.props.exercise.id;
        const dayId = this.props.exercise.dayId;
        this.props.onDeleteClick(dayId, id);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState(prevState => {
            return {
                editedExercise: {...prevState.editedExercise, [name]: value}
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const exercise = this.state.editedExercise;
        const isComplete = ( 
            exercise.name.length != 0 &&
            exercise.strategy.length != 0 &&
            exercise.goal.length != 0 &&
            exercise.sets.length != 0 &&
            exercise.breakdown.length != 0
        );

        if (isComplete) {
            this.props.onEditExercise(exercise);
        }
        else {
            console.log('INCOMPLETE', exercise);
            this.setState({
                isIncomplete: true
            });
        }
        
    }


    render() {
        let messageTemplate;
        if (this.state.isIncomplete) {
            messageTemplate = (<div>{this.state.messages.incomplete}</div>)
        }

        return (
            <div className={styles.editExercise}>
                <nav className={styles.topNav}>
                    <button onClick={this.handleBack}>← Cancel</button>
                    <button onClick={this.handleDelete}>Delete</button>
                </nav>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        Edit exercise
                    </h2>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Name this new day"
                            value={this.state.editedExercise.name}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="strategy">Strategy</label>
                        <select 
                            name="strategy" 
                            value="rpt" 
                            onChange={this.handleInputChange}>
                            <option value="rpt">Reverse Pyramid Training</option>
                        </select>
                        <label htmlFor="goal">Goal</label>
                        <input 
                            type="number" 
                            name="goal" 
                            placeholder="Reps to achieve on first set"
                            min="0"
                            value={this.state.editedExercise.goal}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="sets">Sets</label>
                        <input 
                            type="number" 
                            name="sets" 
                            placeholder="Total number of sets"
                            min="0"
                            value={this.state.editedExercise.sets}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="breakdown">Breakdown</label>
                        <input 
                            type="number"
                            min="0"
                            max="1" 
                            step="0.05"
                            name="breakdown" 
                            placeholder="Weight % to remove after each set"
                            value={this.state.editedExercise.breakdown}
                            onChange={this.handleInputChange}
                        />
                        <button className={styles.buttonSave}>
                            Save exercise
                        </button>
                        {messageTemplate}
                    </form>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => ({
    onEditExercise: (exercise) => dispatch(ActionCreators.editExercise(exercise)),
    onBackClick: () => dispatch(ActionCreators.clearEditingExercise()),
    onDeleteClick: (dayId, id) => {
        dispatch(ActionCreators.clearEditingExercise());
        dispatch(ActionCreators.removeExercise(dayId, id));
    }
});

export default connect(null, mapDispatchToProps)(EditExercise);