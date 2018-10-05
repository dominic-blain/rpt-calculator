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
    }

    handleButtonNextClick(event) {
        const currentExercise = this.props.activeExercise;
        const exerciseCount = this.props.exerciseCount;
        const maxSet = currentExercise.sets;
        const hasReachedEnd = this.props.order + 1 > maxSet;
        const nextSet = this.props.order + 1 <= maxSet ? this.props.order + 1 : 1;
        const nextExercise = this.props.order + 1 > maxSet ? currentExercise.order + 1 : null;
        
        if (hasReachedEnd) {
            this.props.onExerciseEnd();
            if  (nextExercise < exerciseCount) {
                this.props.onButtonNextClickEnd(nextExercise);
            }
            else {
                this.props.onButtonNextClickEnd(-1);
            }
        }
        else {
            this.props.onButtonNextClick(nextSet);
        }
    }

    handleButtonAddRepClick(event) {
        const currentExercise = this.props.activeExercise;
        const currentSet = this.props.order - 1;
        const reps = this.props.reps + 1;
        this.props.onButtonChangeRepClick(currentExercise.id, currentSet, reps);
    }

    handleButtonRemRepClick(event) {
        const currentExercise = this.props.activeExercise;
        const currentSet = this.props.order - 1;
        const reps = Math.max(this.props.reps - 1, 0);
        this.props.onButtonChangeRepClick(currentExercise.id, currentSet, reps);
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
                    <div className={styles.setWeight}>
                        {`${weight} lbs`}
                    </div>
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
    onButtonNextClickEnd: nextExercise => dispatch(ActionCreators.setActiveExercise(nextExercise)),
    onButtonChangeRepClick: (exerciseId, set, reps) => dispatch(ActionCreators.setReps(exerciseId, set, reps))
});

export default connect(null, mapDispatchToProps)(Set);