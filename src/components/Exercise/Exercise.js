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

    handleButtonStartClick() {
        const id = this.props.exercise.id;
        const order = this.props.exercise.order;
        this.props.onButtonStartClick(id, order);
    }

    handleExerciseEnd() {
        const dayId = this.props.exercise.dayId;
        const id = this.props.exercise.id;
        const sets = this.props.exercise.setsData;
        this.props.onExerciseEnd(id, dayId, sets);
    }

    render() {
        
        const isCompleted = this.props.isCompleted;
        const isActive = this.props.isActive;
        const activeSetRef = this.props.activeSetRef;
        const nextExerciseRef = this.props.nextExerciseRef;
        const exercise = this.props.exercise;
        const name = exercise.name;
        const setCount = exercise.sets;
        const rest = exercise.rest;
        const sets = exercise.setsData;
        const exerciseCount = this.props.exerciseCount;

        const exerciseStyles = 
            styles.exercise +' '+
            (isActive ? styles.isActive : '') +' '+
            (isCompleted ? styles.isCompleted : '');
        const dotsCtnStyles = 
            styles.dotsCtn +' '+
            (isActive ? styles.isActive : '');

        const setsTemplate = [];
        const dotsTemplate = [];
        sets.forEach((set, index) => {
            const order = index + 1;
            const isSetActive = order == activeSetRef && isActive;
            const offsetX = (order - activeSetRef) * 100;
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
                    exercise={exercise}
                    exerciseCount={exerciseCount}
                    nextExerciseRef={nextExerciseRef}
                    inlineStyle={inlineStyle}
                    rest={rest}
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
    onButtonStartClick: (id, order) => dispatch(ActionCreators.setActiveExercise(id, order)),
    onExerciseEnd: (id, dayId, sets) => {
        dispatch(ActionCreators.logExercise(id, dayId, sets));
    }
});

const mapStateToProps = state => ({
    activeSetRef: state.root.ui.activeSet
});


export default connect(mapStateToProps, mapDispatchToProps)(Exercise);