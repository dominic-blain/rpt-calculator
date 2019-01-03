import React from 'react';
import * as types from '../../constants/dnd-types';
import { DragSource } from 'react-dnd';
import styles from './EditExerciseCard.less';

const sourceSpecs = {
    beginDrag(props) {
        return {id: props.id}
    }
}

const sourceCollect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}


class EditExerciseCard extends React.Component {
    render() {
        const id = this.props.id;
        const name = this.props.name;
        const sets = this.props.sets;
        const connectDragSource = this.props.connectDragSource;
        const isDragging = this.props.isDragging;

        const editExerciseCardStyles = styles.editExerciseCard + ' ' +
        (isDragging ? styles.isDragging : '');
        
        return connectDragSource(
            <div key={id} className={editExerciseCardStyles}>
                <div className={styles.name}>{name}</div>
                <div className={styles.sets}>× {sets}</div>
            </div>
        )
    }
}

export default DragSource(types.EXERCISE, sourceSpecs, sourceCollect)(EditExerciseCard);