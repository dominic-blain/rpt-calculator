import React from 'react';
import { connect } from 'react-redux';
import Day from './Day';

class Program extends React.Component {
    render() {
        const days = this.props.days;
        const daysTemplate = []
        days.forEach(day => {
            daysTemplate.push(<Day key={day.id} data={day} />)
        });
        return (
            <div className="program">
                {daysTemplate}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        program: state.root.program,
        days: state.root.days
    })
};

export default connect(mapStateToProps)(Program);