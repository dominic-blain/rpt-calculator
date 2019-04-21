import React from 'react';
import styles from './RestCard.less';

class RestCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: this.props.time * 60,
            isRunning: false,
            isDone: false
        }

        this.updateCountdown = this.updateCountdown.bind(this);
    }

    updateCountdown() {
        if (this.state.time === 0) {
            this.setState(prevState => {
                return {
                    time: prevState.time,
                    isRunning: prevState.isRunning,
                    isDone: true
                }
            });
            this.props.onEndRest();
        }
        else {
            this.setState(prevState => {
                return {
                    time: prevState.time - 1,
                    isRunning: true,
                    isDone: prevState.isDone
                }
            });
        }
    }

    render() {
        const time = this.state.time;
        let minutes = time / 60 | 0;
        let seconds = time % 60 | 0;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        const displayTime = minutes + ':' + seconds;


        if (!!this.props.isRunning && !this.state.isRunning) {
            this.updatingCountdown = setInterval(this.updateCountdown, 1000);
        }
        if (!!this.state.isDone) {
            clearInterval(this.updatingCountdown);
        }

        return (
            <div className={styles.restCard}>
               {displayTime}
            </div>
        );
    }
}

export default RestCard;