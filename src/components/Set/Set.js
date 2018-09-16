import React from 'react';
import styles from './Set.less';

class Set extends React.Component {
    render() {
        const goalLog = this.props.goalLog;
        const weight = this.props.weight;
        const isActive = this.props.isActive;
        const setStyles = 
                styles.cardSet +' '+
                (isActive ? styles.isActive : '');
        return (
            <div className={setStyles}>
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
                    <div className={styles.buttonNextSet}>
                    🏋️
                    </div>
                </div>
            </div>
        );
    }
}

export default Set;