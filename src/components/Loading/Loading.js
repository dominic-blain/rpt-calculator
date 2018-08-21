import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.less';

class Loading extends React.Component {
    render() {
        let isLoading = this.props.isLoading;
        let stateClass = isLoading ? 'is-loading' : '';
        let classes = `loading ${stateClass}`;
        return(
            <div className={classes}>
                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"></div>
                    <div className="sk-cube2 sk-cube"></div>
                    <div className="sk-cube4 sk-cube"></div>
                    <div className="sk-cube3 sk-cube"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.ui.isLoading
});

export default connect(mapStateToProps)(Loading);