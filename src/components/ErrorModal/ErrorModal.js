import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './ErrorModal.less';

class ErrorModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.onClose();
    }

    render() {
        const errorMsg = this.props.errorMsg;
        const classes = styles.errorModal + ' ' +
            (!!errorMsg ? styles.isVisible : '');
        
        return (
            <div className={classes}>
                {errorMsg}
            </div>
        )
            
    }
}

const mapStateToProps = state => ({
    errorMsg: state.root.ui.errorMsg
});

export default connect(mapStateToProps)(ErrorModal);
