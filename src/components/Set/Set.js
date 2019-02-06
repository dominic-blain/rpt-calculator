import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './Set.less';

class Set extends React.Component {
    constructor(props) {
        super(props);

        this.handleButtonNextClick = this.handleButtonNextClick.bind(this);
        this.handleButtonAddRepClick = this.handleButtonAddRepClick.bind(this);
        this.handleButtonRemRepClick = this.handleButtonRemRepClick.bind(this);
        this.handleWeightChange = this.handleWeightChange.bind(this);
    }

    handleButtonNextClick(event) {
        const exercise = this.props.exercise;
        const exerciseCount = this.props.exerciseCount;
        const maxSet = exercise.sets;
        const hasReachedEnd = this.props.order + 1 > maxSet;
        const nextSet = this.props.order + 1 <= maxSet ? this.props.order + 1 : 1;
        const nextExerciseRef = this.props.nextExerciseRef;

        if (hasReachedEnd) {
            this.props.onExerciseEnd();
            if  (nextExerciseRef.order < exerciseCount) {
                this.props.onButtonNextClickEnd(nextExerciseRef.id, nextExerciseRef.order);
            }
            else {
                this.props.onButtonNextClickEnd(null);
            }
        }
        else {
            this.props.onButtonNextClick(nextSet);
        }
    }

    handleButtonAddRepClick(event) {
        const exercise = this.props.exercise;
        const currentSet = this.props.order - 1;
        const reps = this.props.reps + 1;
        this.props.onButtonChangeRepClick(exercise.id, currentSet, reps);
    }

    handleButtonRemRepClick(event) {
        const exercise = this.props.exercise;
        const currentSet = this.props.order - 1;
        const reps = Math.max(this.props.reps - 1, 0);
        this.props.onButtonChangeRepClick(exercise.id, currentSet, reps);
    }

    handleWeightChange(event) {
        const exercise = this.props.exercise;
        const currentSet = this.props.order - 1;
        const weight = parseInt(event.target.value);
        this.props.onWeightChange(exercise.id, currentSet, weight);
        
    }

    render() {
        const reps = this.props.reps;
        const weight = this.props.weight;
        const isActive = this.props.isActive;
        const inlineStyle = this.props.inlineStyle;
        const setStyles = 
                styles.cardSet +' '+
                (isActive ? styles.isActive : '');
        return (
            <div className={setStyles} style={inlineStyle}>
                <div className={styles.goalBox}>
                    <div className={styles.setReps}>
                        {reps}
                    </div>
                    <label className={styles.setWeight} style={{'--chars': weight.toString().length + 'ch'}}>
                        <input
                            type="number"
                            name="weight"
                            value={weight}
                            onChange={this.handleWeightChange}
                        />
                        lbs
                    </label>
                </div>
                <div className={styles.setButtons}>
                    <button 
                        className={styles.buttonMinus}
                        onClick={this.handleButtonRemRepClick}>
                        <div className={styles.iconCtn}>
                            –
                        </div>
                    </button>
                    <button 
                        className={styles.buttonPlus}
                        onClick={this.handleButtonAddRepClick}>
                        <div className={styles.iconCtn}>
                            +
                        </div>                        
                    </button>
                    <button 
                        className={styles.buttonNext} 
                        onClick={this.handleButtonNextClick}>
                        <div className={styles.iconCtn}>
                            🏋
                        </div>
                    </button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onButtonNextClick: nextSet => dispatch(ActionCreators.setActiveSet(nextSet)),
    onButtonNextClickEnd: (id, order) => dispatch(ActionCreators.setActiveExercise(id, order)),
    onButtonChangeRepClick: (exerciseId, set, reps) => dispatch(ActionCreators.setReps(exerciseId, set, reps)),
    onWeightChange: (exerciseId, set, weight) => dispatch(ActionCreators.setWeight(exerciseId, set, weight))
});

export default connect(null, mapDispatchToProps)(Set);