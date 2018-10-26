import React from 'react';
import { connect } from 'react-redux';
import styles from './Exercise.less';
import ActionCreators from '../../actions/ActionCreators';
import Set from '../Set/Set';

class Exercise extends React.Component {
    constructor(props) {
        super(props);
        this.handleButtonStartClick = this.handleButtonStartClick.bind(this);
        this.handleExerciseEnd = this.handleExerciseEnd.bind(this);
    }

    handleButtonStartClick(event) {
        const order = this.props.data.order;
        this.props.onButtonStartClick(order);
    }

    handleExerciseEnd() {
        this.props.onExerciseEnd(this.props.data);
    }

    render() {
        
        const isCompleted = this.props.isCompleted;
        const isActive = this.props.isActive;
        const activeSet = this.props.activeSet;
        const activeExercise = this.props.activeExercise;
        const name = this.props.name;
        const setCount = this.props.setCount;
        const sets = this.props.sets;
        const exerciseCount = this.props.exerciseCount;

        const exerciseStyles = 
            styles.exercise +' '+
            (isActive ? styles.isActive : '');
            // TODO: remove line above and uncomment lines below
            // (isActive ? styles.isActive : '') +' '+
            // (isCompleted ? styles.isCompleted : '');
        const dotsCtnStyles = 
            styles.dotsCtn +' '+
            (isActive ? styles.isActive : '');

        const setsTemplate = [];
        const dotsTemplate = [];
        sets.forEach((set, index) => {
            const order = index + 1;
            const isSetActive = order == activeSet && isActive;
            const offsetX = (order - activeSet) * 100;
            const inlineStyle = {transform: `translateX(${offsetX}%)`}
            const dotStyles = 
                styles.dot +' '+
                (isSetActive ? styles.isActive : '');
            setsTemplate.push(
               <Set
                    key={index}
                    order={order}
                    reps={set.reps}
                    weight={set.weight}
                    isActive={isSetActive}
                    activeExercise={activeExercise}
                    exerciseCount={exerciseCount}
                    inlineStyle={inlineStyle}
                    onExerciseEnd={this.handleExerciseEnd}
                />
            );
            dotsTemplate.push(
                <div key={index} className={dotStyles}></div>
            );
        });
        return (
            <section className={exerciseStyles}>
                <h2 className={styles.name}>{name}</h2>
                <div className={styles.cardCtn}>
                    <div className={styles.card}>
                        <div className={styles.cardDetails}>
                            <span className={styles.cardSets}>
                                {`${setCount} sets`}
                            </span>
                            <span className={styles.cardGoal}>
                                {`${sets[0].reps} × ${sets[0].weight} lbs`}
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
                    <div className={styles.cardCompleted}>
                        <div className={styles.label}>
                            Completed
                        </div>
                        <div className={styles.icon}>
                        ✅
                        </div>
                    </div>
                    <div className={styles.setsCtn}>
                        {setsTemplate}
                    </div>
                    <div className={dotsCtnStyles}>
                        {dotsTemplate}
                    </div>
                </div>
            </section>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onButtonStartClick: order => dispatch(ActionCreators.setActiveExercise(order)),
    onExerciseEnd: exercise => dispatch(ActionCreators.logExercise(exercise))
});

const mapStateToProps = state => ({
    activeSet: state.root.ui.activeSet,
    activeExercise: state.root.exercises[state.root.days[0].exercises[state.root.ui.activeExercise]]
});


export default connect(mapStateToProps, mapDispatchToProps)(Exercise);