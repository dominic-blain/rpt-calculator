import React from 'react';
import { connect } from 'react-redux';

class Program extends React.Component {
    render() {
        return (
            <h1>Welcome</h1>
        )
    }
}

const mapStateToProps = state => ({
    user: state.currentUser
});

export default connect(mapStateToProps)(Program);