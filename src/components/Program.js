import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

class Program extends React.Component {
    render() {
        const programId = this.props.programId;
        return (
            <h1>{`Program ${programId}`}</h1>
        )
    }
}

const mapStateToProps = (state, props) => ({
    program: state.firestore.data.programs
});

const mapFirestoreToProps = (state, props) => [
    {collection: 'programs', doc: state.currentProgram}
];

export default firestoreConnect(mapFirestoreToProps)(Program);