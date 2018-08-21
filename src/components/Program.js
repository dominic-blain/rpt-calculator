import React from 'react';
import { connect } from 'react-redux';

class Program extends React.Component {
    render() {
        console.log(this.props);
        let user = this.props.user;
        let userName = `${user.name.first} ${user.name.last}`;
        return (
            <h1>Hello {userName}</h1>
        );
    }
}

const mapStateToProps = state => ({
    user: state.currentUser
});

export default connect(mapStateToProps)(Program);