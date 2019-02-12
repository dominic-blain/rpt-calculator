import React from 'react';
import { connect } from 'react-redux';
import ActionCreators from '../../actions/ActionCreators';
import styles from './Navigation.less';

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const target = event.target;
        const destination = target.dataset.destination;
        this.props.onButtonClick(destination);
    }

    render() {
        const activeView = this.props.activeView;
        const analyseStyles = activeView === 'Analyse' ? styles.isActive : '';
        const workoutStyles = activeView === 'Workout' ? styles.isActive : '';
        const manageStyles = activeView === 'Manage' ? styles.isActive : '';
        const navStyles = styles.navigation + ' ' + 
            (activeView === 'Manage' ? styles.isReversed : '');

        return (
            <nav className={navStyles}>
                <button 
                    className={analyseStyles}
                    // onClick={this.handleClick}
                    data-destination="Analyse">
                    📈
                </button>
                <button 
                    className={workoutStyles}
                    onClick={this.handleClick}
                    data-destination="Workout">
                    🔥
                </button>
                <button 
                    className={manageStyles}
                    onClick={this.handleClick}
                    data-destination="Manage">
                    👤
                </button>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    activeView: state.root.ui.activeView
})

const mapDispatchToProps = dispatch => ({
    onButtonClick: destination => dispatch(ActionCreators.setActiveView(destination))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);