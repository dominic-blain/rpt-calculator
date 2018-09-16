import React from 'react';
import { connect } from 'react-redux';
import styles from './Exercise.less';
import ActionCreators from '../../actions/ActionCreators';
import Set from '../Set/Set';

class Exercise extends React.Component {
    constructor(props) {
        super(props);
        this.handleButtonStartClick = this.handleButtonStartClick.bind(this);
    }

    handleButtonStartClick(event) {
        const id = this.props.data.id;
        this.props.onButtonStartClick(id);
    }

    render() {
        const isActive = this.props.isActive;
        const activeSet = this.props.activeSet;
        const data = this.props.data;
        const name = data.name;
        const sets = data.sets;
        const breakdown = data.breakdown;
        const goalLog = !!data.goalLog ? data.goalLog : {
            reps: data.goal,
            weight: 0
        };
        const exerciseStyles = 
            styles.exercise +' '+
            (isActive ? styles.isActive : '');

        var setsTemplate = []
        for (let setCount = 1; setCount <= sets; setCount++) {
            const setWeight = goalLog.weight * (1 - breakdown * setCount); 
            const isSetActive = setCount == activeSet && isActive;
            const offsetX = (setCount - activeSet) * 100;
            const inlineStyle = {transform: `translateX(${offsetX}%)`}

            setsTemplate.push(
               <Set
                    key={setCount}
                    order={setCount}
                    goalLog={goalLog}
                    weight={setWeight}
                    isActive={isSetActive}
                    inlineStyle={inlineStyle}
                />
            );
        }

        // const reps = data.reps;
        // const weight = data.weight;
        return (
            <section className={exerciseStyles}>
                <h2 className={styles.name}>{name}</h2>
                <div className={styles.cardCtn}>
                    <div className={styles.card}>
                        <div className={styles.cardDetails}>
                            <span className={styles.cardSets}>
                                {`${sets} sets`}
                            </span>
                            <span className={styles.cardGoal}>
                                {`${goalLog.reps} × ${goalLog.weight} lbs`}
                            </span>
                        </div>
                        <button className={styles.buttonLogs}>
                        📈
                        </button>
                        <button 
                            className={styles.buttonStart}
                            onClick={this.handleButtonStartClick}>
                        💪
                        </button>
                    </div>
                    <div className={styles.setsCtn}>
                        {setsTemplate}
                    </div>
                </div>
            </section>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onButtonStartClick: id => dispatch(ActionCreators.setActiveExercise(id))
});

const mapStateToProps = state => ({
    activeSet: state.root.ui.activeSet
});


export default connect(mapStateToProps, mapDispatchToProps)(Exercise);