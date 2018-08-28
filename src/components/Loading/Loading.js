import React from 'react';
import { connect } from 'react-redux';
import styles from './Loading.less';

class Loading extends React.Component {
    render() {
        let isLoading = this.props.isLoading;
        let stateClass = isLoading ? styles.isLoading : '';
        let classes = `${styles.loading} ${stateClass}`;
        return(
            <div className={classes}>
                <div className={styles.cube}>
                    <div className={styles.cubeFace}></div>
                    <div className={`${styles.cubeFace} ${styles.cubeFace2}`}></div>
                    <div className={`${styles.cubeFace} ${styles.cubeFace4}`}></div>
                    <div className={`${styles.cubeFace} ${styles.cubeFace3}`}></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.root.ui.isLoading
});

export default connect(mapStateToProps)(Loading);