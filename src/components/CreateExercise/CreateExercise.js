import React from 'react';
import { connect } from 'react-redux';

class CreateExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newExercise: {
                name: '',
                strategy: 'rpt',
                goal: '',
                setCount: '',
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
        }, () => console.log(this.state.newExercise));
    }

    handleSubmit(event) {
        event.preventDefault();
        const exercise = this.state.newExercise;
        const isComplete = ( 
            exercise.name.length &&
            exercise.strategy.length &&
            exercise.goal.length &&
            exercise.setCount.length &&
            exercise.breakdown.length
        );

        if (isComplete) {
            console.log('COMPLETE', exercise);
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
            <div className="createExercise">
                <h2 className="title">
                    New
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
                        type="text" 
                        name="goal" 
                        placeholder="Reps to achieve on first set"
                        value={this.state.newExercise.goal}
                        onChange={this.handleInputChange}
                    />
                    <label htmlFor="setCount">Sets</label>
                    <input 
                        type="number" 
                        name="setCount" 
                        placeholder="Total number of sets"
                        value={this.state.newExercise.setCount}
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
                    <button>
                        Create exercise
                    </button>
                    {messageTemplate}
                </form>
            </div>
        );
    }
}

export default CreateExercise;