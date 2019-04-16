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
            <div className={classes} onClick={this.handleClose}>
                {errorMsg}
            </div>
        )
            
    }
}

const mapStateToProps = state => ({
    errorMsg: state.root.ui.errorMsg
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(ActionCreators.setErrorMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
