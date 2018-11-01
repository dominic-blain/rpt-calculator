import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';

class ButtonSignOut extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onButtonClick();
    }
    
    render() {
        return (
            <button onClick={this.handleClick}>
                Sign out
            </button>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onButtonClick: () => dispatch(ActionCreators.signOut())
});

export default connect(null, mapDispatchToProps)(ButtonSignOut); 