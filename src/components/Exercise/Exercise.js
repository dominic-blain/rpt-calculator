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
        const activeExercise = this.props.activeExercise;
        const data = this.props.data;
        const name = data.name;
        const sets = data.sets;
        const setsData = data.setsData;

        const exerciseStyles = 
            styles.exercise +' '+
            (isActive ? styles.isActive : '');
        const dotsCtnStyles = 
            styles.dotsCtn +' '+
            (isActive ? styles.isActive : '');

        const setsTemplate = [];
        const dotsTemplate = [];
        setsData.forEach((set, index) => {
            const order = index + 1;
            const isSetActive = order == activeSet && isActive;
            const offsetX = (order - activeSet) * 100;
            const inlineStyle = {transform: `translateX(${offsetX}%)`}
            const dotStyles = 
                styles.dot +' '+
                (isSetActive ? styles.isActive : '');
            console.log(index, set)
            setsTemplate.push(
               <Set
                    key={index}
                    order={order}
                    reps={set.reps}
                    weight={set.weight}
                    isActive={isSetActive}
                    activeExercise={activeExercise}
                    inlineStyle={inlineStyle}
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
                                {`${sets} sets`}
                            </span>
                            <span className={styles.cardGoal}>
                                {`${setsData[0].reps} × ${setsData[0].weight} lbs`}
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
                    <div className={dotsCtnStyles}>
                        {dotsTemplate}
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
    activeSet: state.root.ui.activeSet,
    activeExercise: state.root.exercises[state.root.ui.activeExercise]
    
});


export default connect(mapStateToProps, mapDispatchToProps)(Exercise);