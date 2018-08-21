import React from 'react';
import { connect } from 'react-redux';

class Program extends React.Component {
    render() {
        let user = this.props.user;
        let userName = user.name !== undefined ? user.name.first : '';
        let greetings = (!!userName.length ? 
            `Hello ${userName}`:
            'Hello wanderer'
        );
        return (
            <h1>{greetings}</h1>
        );
    }
}

const mapStateToProps = state => ({
    user: state.currentUser
});

export default connect(mapStateToProps)(Program);