import React from 'react';
import styles from './RestCard.less';

class RestCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: this.props.time * 60,
            isInited: false,
            intervalId: null
        }

        this.updateCountdown = this.updateCountdown.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.updatingCountdown);
    }

    updateCountdown() {
        if (this.state.time === 0) {
            console.log('END: '+ this.props.exercise.name + ' | Set '+ this.props.order +' id: '+ this.updatingCountdown);
            clearInterval(this.updatingCountdown);
            this.setState(prevState => {
                return {
                    time: prevState.time,
                    isInited: true
                }
            });
            this.props.onEndRest(this.updatingCountdown);
        }
        else {
            console.log('UPDATE: ' + this.props.exercise.name + ' | Set '+ this.props.order);
            this.setState(prevState => {
                return {
                    time: prevState.time - 1,
                    isInited: true
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
            console.log('INIT: '+ this.props.exercise.name + ' | Set '+ this.props.order  +' id: '+ this.updatingCountdown);
        }
        // else if (!this.props.isRunning && this.state.isInited) {
        //     console.log(this.props.exercise.name + ' CLEAR: Set '+ this.props.order);
        //     clearInterval(this.updateCountdown);
        // }

        return (
            <div className={styles.restCard}>
               {displayTime}
            </div>
        );
    }
}

export default RestCard;