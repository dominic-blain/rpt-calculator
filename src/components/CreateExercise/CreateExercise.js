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
                strategy: 'linear',
                goal: '',
                sets: '',
                breakdown: '',
                progression: '',
                reps: '',
                rest: '',
                weight: '',
            },
            messages: {
                incomplete: 'Please fill all data'
            },
            isIncomplete: false
        }

        this.strategyFields = {
            rpt: [
                'goal',
                'sets',
                'breakdown'
            ],
            linear: [
                'reps',
                'sets',
                'weight',
                'progression'
            ],
            manual: [
                'reps',
                'sets',
                'weight'
            ]
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.validateStrategy = this.validateStrategy.bind(this);
    }

    handleBack() {
        this.props.onBackClick();
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

    validateStrategy() {
        const currentStrategyFields = this.strategyFields[this.state.newExercise.strategy];
        let isComplete = true;
        currentStrategyFields.forEach(key => {
            if (this.state.newExercise[key].length === 0) {
                isComplete = false;
                return;
            }
        });
        return isComplete;
    }

    handleSubmit(event) {
        event.preventDefault();
        const exercise = this.state.newExercise;
        const dayId = this.props.dayId;
        const strategyIsComplete = this.validateStrategy();
        const isComplete = ( 
            exercise.name.length != 0 &&
            exercise.strategy.length != 0 &&
            strategyIsComplete &&
            exercise.rest.length != 0
        );

        if (isComplete) {
            this.props.onCreateExercise(exercise, dayId);
        }
        else {
            this.setState({
                isIncomplete: true
            });
        }
        
    }


    render() {
        const values = this.state.newExercise;
        const currentStrategy = values.strategy;
        let messageTemplate;
        if (this.state.isIncomplete) {
            messageTemplate = (<div>{this.state.messages.incomplete}</div>)
        }

        return (
            <div className={styles.createExercise}>
                <nav className={styles.topNav}>
                    <button onClick={this.handleBack}>← Cancel</button>
                </nav>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        New exercise
                    </h2>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Name this new day"
                            value={values.name}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="strategy">Strategy</label>
                        <select 
                            name="strategy" 
                            value={values.strategy} 
                            onChange={this.handleInputChange}>
                            <option value="rpt">Reverse Pyramid Training</option>
                            <option value="linear">Linear Progression</option>
                            <option value="manual">Manual</option>
                        </select>
                        {this.strategyFields[currentStrategy].includes('goal') &&
                            <div>
                                <label htmlFor="goal">Goal</label>
                                <input 
                                    type="number" 
                                    name="goal" 
                                    placeholder="Reps to achieve on first set"
                                    min="0"
                                    value={values.goal}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        }
                        {this.strategyFields[currentStrategy].includes('sets') &&
                            <div>
                                <label htmlFor="sets">Sets</label>
                                <input 
                                    type="number" 
                                    name="sets" 
                                    placeholder="Total number of sets"
                                    min="0"
                                    value={values.sets}
                                    onChange={this.handleInputChange}
                                />
                        </div>
                        }
                        {this.strategyFields[currentStrategy].includes('breakdown') &&
                            <div>
                                <label htmlFor="breakdown">Breakdown</label>
                                <input 
                                    type="number"
                                    min="0"
                                    max="1" 
                                    step="0.05"
                                    name="breakdown" 
                                    placeholder="Weight % to remove after each set"
                                    value={values.breakdown}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        }
                        {this.strategyFields[currentStrategy].includes('progression') &&
                            <div>
                                <label htmlFor="progression">Progression</label>
                                <input 
                                    type="number"
                                    min="0"
                                    step="2.5"
                                    name="progression" 
                                    placeholder="Weight (lbs) to add after each successful workout"
                                    value={values.progression}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        }
                        {this.strategyFields[currentStrategy].includes('reps') &&
                            <div>
                                <label htmlFor="reps">Reps</label>
                                <input 
                                    type="number" 
                                    name="reps" 
                                    placeholder="Total number of reps"
                                    min="1"
                                    value={values.reps}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        }
                        {this.strategyFields[currentStrategy].includes('weight') &&
                            <div>
                                <label htmlFor="weight">Weight</label>
                                <input 
                                    type="number" 
                                    name="weight" 
                                    placeholder="Weight (lbs)"
                                    min="0"
                                    value={values.weight}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        }
                        <label htmlFor="rest">Rest time</label>
                         <input 
                            type="number"
                            min="0"
                            step="0.25"
                            name="rest" 
                            placeholder="2.5"
                            value={values.rest}
                            onChange={this.handleInputChange}
                        />
                        <button className={styles.buttonCreate}>
                            Create exercise
                        </button>
                        {messageTemplate}
                    </form>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => ({
    onCreateExercise: (exercise, dayId) => dispatch(ActionCreators.createExercise(exercise, dayId)),
    onBackClick: () => dispatch(ActionCreators.clearEditingExercise())
});

export default connect(null, mapDispatchToProps)(CreateExercise);