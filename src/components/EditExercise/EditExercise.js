import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './EditExercise.less';

class EditExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editedExercise: {
                name: props.exercise.name || '',
                strategy: props.exercise.strategy || '',
                goal: props.exercise.goal || '',
                sets: props.exercise.sets || '',
                breakdown: props.exercise.breakdown || '',
                reps: props.exercise.reps || '',
                rest: props.exercise.rest || '',
                weight: props.exercise.weight || '',
                order: props.exercise.order || '0',
                dayId: props.exercise.dayId || '',
                id: props.exercise.id
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
            manual: [
                'reps',
                'sets',
                'weight'
            ]
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.validateStrategy = this.validateStrategy.bind(this);
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

    validateStrategy() {
        const currentStrategyFields = this.strategyFields[this.state.editedExercise.strategy];
        let isComplete = true;
        currentStrategyFields.forEach(key => {
            if (this.state.editedExercise[key].length === 0) {
                isComplete = false;
                return;
            }
        });
        return isComplete;
    }

    handleSubmit(event) {
        event.preventDefault();
        const exercise = this.state.editedExercise;
        const strategyIsComplete = this.validateStrategy();
        const isComplete = ( 
            exercise.name.length != 0 &&
            exercise.strategy.length != 0 &&
            strategyIsComplete &&
            exercise.rest.length != 0
        );

        if (isComplete) {
            this.props.onEditExercise(exercise);
        }
        else {
            this.setState({
                isIncomplete: true
            });
        }
        
    }


    render() {
        const values = this.state.editedExercise;
        const currentStrategy = values.strategy;
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
                            value={values.name}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="strategy">Strategy</label>
                        <select 
                            name="strategy" 
                            value={values.strategy} 
                            onChange={this.handleInputChange}>
                            <option value="rpt">Reverse Pyramid Training</option>
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
                            step="0.1"
                            name="rest" 
                            placeholder="2.5"
                            value={values.rest}
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