import React from 'react';
import styles from './RestCard.less';

class RestCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: this.props.time * 60
        }

        this.updateCountdown = this.updateCountdown.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.updatingCountdown);
    }

    updateCountdown() {
        if (this.state.time === 0) {
            clearInterval(this.updatingCountdown);
            this.setState(prevState => {
                return {
                    time: prevState.time
                }
            });
            this.props.onEndRest(this.updatingCountdown);
        }
        else {
            this.setState(prevState => {
                return {
                    time: prevState.time - 1
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

        if (!!this.props.isRunning && !this.updatingCountdown) {
            this.updatingCountdown = setInterval(this.updateCountdown, 1000);
        }

        return (
            <div className={styles.restCard}>
               {displayTime}
            </div>
        );
    }
}

export default RestCard;