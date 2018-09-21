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
        const maxSet = currentExercise.sets;
        const nextSet = this.props.order + 1 <= maxSet ? this.props.order + 1 : 1;
        this.props.onButtonNextClick(nextSet); 
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
                    <div 
                        className={styles.buttonMinus}
                        onClick={this.handleButtonRemRepClick}>
                    –
                    </div>
                    <div 
                        className={styles.buttonPlus}
                        onClick={this.handleButtonAddRepClick}>
                    +
                    </div>
                    <div 
                        className={styles.buttonNext} 
                        onClick={this.handleButtonNextClick}>
                    🏋
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onButtonNextClick: id => dispatch(ActionCreators.setActiveSet(id)),
    onButtonChangeRepClick: (exerciseId, set, reps) => dispatch(ActionCreators.setReps(exerciseId, set, reps))
});

export default connect(null, mapDispatchToProps)(Set);