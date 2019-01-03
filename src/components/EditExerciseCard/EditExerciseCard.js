import React from 'react';
import TouchBackend from 'react-dnd-touch-backend';
import * as types from '../../constants/dnd-types';
import {
	DragSource,
	DropTarget,
	ConnectDropTarget,
	ConnectDragSource,
	DropTargetMonitor,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor,
} from 'react-dnd'
import styles from './EditExerciseCard.less';



class EditExerciseCard extends React.Component {
    render() {
        const id = this.props.id;
        const name = this.props.name;
        const sets = this.props.sets;
        
        return (
            <div key={id} className={styles.editExerciseCard}>
                <div className={styles.name}>{name}</div>
                <div className={styles.sets}>× {sets}</div>
            </div>
        )
    }
}

export default EditExerciseCard;