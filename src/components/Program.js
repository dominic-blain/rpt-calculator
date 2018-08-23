import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';

class Program extends React.Component {
    render() {
        const programId = this.props.programId;
        return (
            <h1>{`Program ${programId}`}</h1>
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        program: isLoaded(state.firestore.data.programs) ? 
            state.firestore.data.programs[props.programId] :
            ''
    })
};

const mapFirestoreToProps = props => {
    let queryArray = [];
    if (!!props.programId) {
        queryArray.push({ collection: 'programs', doc: props.programId });
        queryArray.push({ collection: 'programs', doc: props.programId, subcollections: [{collection: 'days'}] });
    }
    return queryArray;
};

export default compose(
    firestoreConnect(mapFirestoreToProps),
    connect(mapStateToProps)
)(Program);