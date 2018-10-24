import React from 'react';

class DayCard extends React.Component {
    render() {
        const name = this.props.name;
        const exercises = this.props.exercises;
        const isCompleted = this.props.isCompleted;

        const exerciseTemplates = exercises.map(exercise => {
            return (
                <div key={exercise.id} className="exercise">
                    <div className="exerciseName">{exercise.name}</div>
                    <div className="exerciseSets">{exercise.sets}</div>
                </div>
            )
        });

        
        return (
            <section className="dayCard">
                <h2 className="title">{name}</h2>
                <div className="exercisesCtn">{exerciseTemplates}</div>
                
            </section>
        )
    }
}


export default DayCard;