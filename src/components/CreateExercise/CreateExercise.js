import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './CreateExercise.less';

class CreateExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newExercise: {
                name: '',
                strategy: 'rpt',
                goal: '',
                sets: '',
                breakdown: ''
            },
            messages: {
                incomplete: 'Please fill all data'
            },
            isIncomplete: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState(prevState => {
            return {
                newExercise: {...prevState.newExercise, [name]: value}
            }
        }, () => console.log(this.state));
    }

    handleSubmit(event) {
        event.preventDefault();
        const exercise = this.state.newExercise;
        const isComplete = ( 
            exercise.name.length != 0 &&
            exercise.strategy.length != 0 &&
            exercise.goal.length != 0 &&
            exercise.sets.length != 0 &&
            exercise.breakdown.length != 0
        );

        if (isComplete) {
            this.props.onCreateExercise(exercise);
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
            <div className={styles.createExercise}>
                <h2 className={styles.title}>
                    New exercise
                </h2>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name this new day"
                        value={this.state.newExercise.name}
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
                        value={this.state.newExercise.goal}
                        onChange={this.handleInputChange}
                    />
                    <label htmlFor="sets">Sets</label>
                    <input 
                        type="number" 
                        name="sets" 
                        placeholder="Total number of sets"
                        min="0"
                        value={this.state.newExercise.sets}
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
                        value={this.state.newExercise.breakdown}
                        onChange={this.handleInputChange}
                    />
                    <button className={styles.buttonCreate}>
                        Create exercise
                    </button>
                    {messageTemplate}
                </form>
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => ({
    onCreateExercise: (exercise) => dispatch(ActionCreators.createExercise(exercise))
});

export default connect(null, mapDispatchToProps)(CreateExercise);