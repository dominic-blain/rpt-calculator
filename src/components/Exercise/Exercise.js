import React from 'react';
import { connect } from 'react-redux';
import styles from './Exercise.less';
import ActionCreators from '../../actions/ActionCreators';
import Set from '../Set/Set';

class Exercise extends React.Component {
    constructor(props) {
        super(props);
        this.handleButtonLogsClick = this.handleButtonLogsClick.bind(this);
        this.handleButtonStartClick = this.handleButtonStartClick.bind(this);
        this.handleExerciseEnd = this.handleExerciseEnd.bind(this);

        this.state = {
            isLogsOpen: false
        }
    }

    handleButtonLogsClick() {
        this.setState(prevState => {
            return {
                isLogsOpen: !prevState.isLogsOpen
            }
        });
    }

    handleButtonStartClick() {
        this.setState(() => {
            return {
                isLogsOpen: false
            }
        });
        const id = this.props.exercise.id;
        const order = this.props.exercise.order;
        this.props.onButtonStartClick(id, order);
    }

    handleExerciseEnd() {
        const dayId = this.props.exercise.dayId;
        const id = this.props.exercise.id;
        const sets = this.props.exercise.setsData;
        this.setState(() => {
            return {
                isLogsOpen: false
            }
        });
        this.props.onExerciseEnd(id, dayId, sets);
    }

    render() {
        
        const isCompleted = this.props.isCompleted;
        const isActive = this.props.isActive;
        const nextExerciseRef = this.props.nextExerciseRef;
        const exercise = this.props.exercise;
        const name = exercise.name;
        const setCount = exercise.sets;
        const rest = exercise.rest;
        const sets = exercise.setsData;
        const lastLogs = exercise.lastLogs;
        const exerciseCount = this.props.exerciseCount;
        const progress = this.props.progress[exercise.id];

        const lastLogsStyleObject = {
            "--setCount": setCount
        }

        const exerciseStyles = 
            styles.exercise +' '+
            (isActive ? styles.isActive : '') +' '+
            (isCompleted ? styles.isCompleted : '');
        const dotsCtnStyles = 
            styles.dotsCtn +' '+
            (isActive ? styles.isActive : '');
        const lastLogCtnStyles = 
            styles.lastLogCtn +' '+
            (isActive ? styles.isActive : '');
        const lastLogsCtnStyles = 
            styles.lastLogsCtn +' '+
            (this.state.isLogsOpen ? styles.isActive : '');

        const setsTemplate = [];
        const dotsTemplate = [];
        const lastLogTemplate = [];
        const lastLogsTemplate = [];
        sets.forEach((set, index) => {
            const order = index + 1;
            const lastLog = lastLogs[index];
            const lastLogLabel = !!lastLog ? `${lastLog.reps} × ${lastLog.weight} lbs` : '';
            const setProgress = progress.sets[index];
            const isSetActive = order == progress.activeSet && isActive;
            const offsetX = (order - progress.activeSet) * 100;
            const inlineStyle = {transform: `translateX(${offsetX}%)`};
            const dotStyles = 
                styles.dot +' '+
                (isSetActive ? styles.isActive : '');
            const logStyles = 
                styles.log +' '+
                (isSetActive ? styles.isActive : '');
            setsTemplate.push(
               <Set
                    key={exercise.id + '-' + index}
                    order={order}
                    reps={set.reps}
                    weight={set.weight}
                    isActive={isSetActive}
                    exercise={exercise}
                    exerciseCount={exerciseCount}
                    nextExerciseRef={nextExerciseRef}
                    inlineStyle={inlineStyle}
                    rest={rest}
                    progress={setProgress}
                    lastLog={lastLog}
                    onExerciseEnd={this.handleExerciseEnd}
                />
            );
            dotsTemplate.push(
                <div key={index} className={dotStyles}></div>
            );
            lastLogTemplate.push(
                <div key={index} className={logStyles}>{lastLogLabel}</div>
            );
            lastLogsTemplate.push(
                <div key={index} className={logStyles}>
                    <span className={styles.logIndex}>{index + 1}</span>
                    <span className={styles.logLabel}>{lastLogLabel}</span>
                </div>
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
                        <button 
                            className={styles.buttonLogs}
                            onClick={this.handleButtonLogsClick}>
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
                    <div className={lastLogCtnStyles}>
                        {lastLogTemplate}
                    </div>
                    
                </div>
                <div className={lastLogsCtnStyles} style={lastLogsStyleObject}>
                        {lastLogsTemplate}
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
    activeSetRef: state.root.ui.activeSet,
    progress: state.root.ui.progress
});


export default connect(mapStateToProps, mapDispatchToProps)(Exercise);