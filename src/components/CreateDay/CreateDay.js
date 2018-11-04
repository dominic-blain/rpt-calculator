import React from 'react';
import styles from './CreateDay.less';

class CreateDay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            exercises: []
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddExercise = this.handleAddExercise.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleAddExercise() {
        this.props.onAddExercise();
    }

    handleSubmit() {

    }

    render() {
        return (
             <form className={styles.createDay}>
                <h2 className="title">Create day</h2>
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Name this new day"
                    value={this.state.name.value}
                    onChange={this.handleInputChange}
                />
                <button type="button" onClick={this.handleAddExercise}>
                    Add exercise
                </button>
             </form>
        );
    }
}

export default CreateDay;