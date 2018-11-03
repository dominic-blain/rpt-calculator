import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';

class EmptyProgram extends React.Component {
    constructor(props) {
        super(props)
        this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
    }

    handleCreateButtonClick() {
        this.props.onCreateButtonClick();
    }

    render() {
        return (
            <div>
                <h1>Oups, no program</h1>
                <button onClick={this.handleCreateButtonClick}>Create program</button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onCreateButtonClick: () => {dispatch(ActionCreators.setActiveView('Manage'))}
});

export default connect(null, mapDispatchToProps)(EmptyProgram);