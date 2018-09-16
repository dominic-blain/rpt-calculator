import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './Set.less';

class Set extends React.Component {
    constructor(props) {
        super(props);
        this.handleButtonNextClick = this.handleButtonNextClick.bind(this);
    }

    handleButtonNextClick(event) {
        const nextSetId = this.props.order + 1;
        this.props.onButtonNextClick(nextSetId);
    }

    render() {
        const goalLog = this.props.goalLog;
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
                        {goalLog.reps}
                    </div>
                    <div className={styles.setWeight}>
                        {`${weight} lbs`}
                    </div>
                </div>
                <div className={styles.setButtons}>
                    <div className={styles.buttonMinus}>
                    –
                    </div>
                    <div className={styles.buttonPlus}>
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
    onButtonNextClick: id => dispatch(ActionCreators.setActiveSet(id))
});

export default connect(null, mapDispatchToProps)(Set);