import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './EmptyProgram.less';

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
            <div className={styles.emptyProgram}>
                <h1 className={styles.title}>You don't have any programs yet</h1>
                <p className={styles.description}>Start by creating a new program or choose from one of our template. You can of course completly customize it to fit your specific needs</p>
                <button
                    className={styles.buttonNew} 
                    onClick={this.handleCreateButtonClick}>
                    Create new program
                </button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onCreateButtonClick: () => {dispatch(ActionCreators.setActiveView('Manage'))}
});

export default connect(null, mapDispatchToProps)(EmptyProgram);