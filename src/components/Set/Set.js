import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './Set.less';
import RestCard from '../RestCard/RestCard';

class Set extends React.Component {
    constructor(props) {
        super(props);

        this.handleEndRest = this.handleEndRest.bind(this);
        this.handleButtonNextClick = this.handleButtonNextClick.bind(this);
        this.handleButtonAddRepClick = this.handleButtonAddRepClick.bind(this);
        this.handleButtonRemRepClick = this.handleButtonRemRepClick.bind(this);
        this.handleWeightChange = this.handleWeightChange.bind(this);
    }

    handleEndRest() {
        const exercise = this.props.exercise;
        this.props.onSetProgressChange(exercise.id, this.props.order - 1, {
            isResting: false,
            isCompleted: true
        });
        this.handleButtonNextClick();
    }

    handleButtonNextClick() {
        const exercise = this.props.exercise;
        const exerciseCount = this.props.exerciseCount;
        const maxSet = exercise.sets;
        const hasReachedEnd = this.props.order + 1 > maxSet;
        const nextSet = this.props.order + 1 <= maxSet ? this.props.order + 1 : 1;
        const nextExerciseRef = this.props.nextExerciseRef;
        const progress = this.props.progress;

        if (!!this.props.rest && !progress.isCompleted) {
            this.props.onSetProgressChange(exercise.id, this.props.order - 1, {
                isResting: true,
                isCompleted: false
            });
        }
        else if (hasReachedEnd) {
            this.props.onExerciseEnd();
            if  (nextExerciseRef.order < exerciseCount) {
                // Reset next set progress to prevent weird behavior
                this.props.onSetProgressChange(exercise.id, this.props.order, {
                    isResting: false,
                    isCompleted: false
                });
                this.props.onButtonNextClickEnd(nextExerciseRef.id, nextExerciseRef.order);
            }
            else {
                this.props.onButtonNextClickEnd(null);
            }
        }
        else {
            this.props.onButtonNextClick(exercise.id, nextSet);
        }
    }

    handleButtonAddRepClick() {
        const exercise = this.props.exercise;
        const currentSet = this.props.order - 1;
        const reps = this.props.reps + 1;
        this.props.onButtonChangeRepClick(exercise.id, currentSet, reps);
    }

    handleButtonRemRepClick() {
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
        const rest = this.props.rest;
        const progress = this.props.progress;
        const isActive = this.props.isActive;
        const inlineStyle = this.props.inlineStyle;
        const setStyles = 
                styles.cardSet +' '+
                (isActive ? styles.isActive : '');
        const restCtnStyles = 
                styles.restCtn +' '+
                (progress.isResting || progress.isCompleted ? styles.isResting : '');
        
        const restTemplate = !!rest ? (
            <RestCard 
                exercise={this.props.exercise}
                order={this.props.order}
                time={rest}
                isRunning={progress.isResting && !progress.isCompleted}
                onEndRest={this.handleEndRest} />
        ) : null;

        return (
            <div className={setStyles} style={inlineStyle}>
                <div className={styles.setCtn}>
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
                <div className={restCtnStyles}>
                    {restTemplate}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onSetProgressChange: (exerciseId, setOrder, progress) => dispatch(ActionCreators.updateSetProgress(exerciseId, setOrder, progress)),
    onButtonNextClick: (exerciseId, nextSet) => dispatch(ActionCreators.setActiveSet(exerciseId, nextSet)),
    onButtonNextClickEnd: (id, order) => dispatch(ActionCreators.setActiveExercise(id, order)),
    onButtonChangeRepClick: (exerciseId, set, reps) => dispatch(ActionCreators.setReps(exerciseId, set, reps)),
    onWeightChange: (exerciseId, set, weight) => dispatch(ActionCreators.setWeight(exerciseId, set, weight))
});

export default connect(null, mapDispatchToProps)(Set);