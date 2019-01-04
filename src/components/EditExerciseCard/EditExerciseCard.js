import React from 'react';
import { findDOMNode } from 'react-dom';
import * as types from '../../constants/dnd-types';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import styles from './EditExerciseCard.less';

const sourceSpecs = {
    beginDrag(props) {
        return {
            id: props.id,
            name: props.name,
            order: props.order
        }
    }
}

const targetSpecs = {
    hover(props, monitor, component) {
        if(!component) {
            return
        }
        const sourceIndex = monitor.getItem().order;
        const targetIndex = props.order;

        if (sourceIndex === targetIndex) {
            return
        }

        const targetBox = findDOMNode(component).getBoundingClientRect();
        const targetMiddleY = targetBox.top + targetBox.height / 2;
        const mousePosition = monitor.getClientOffset();
        const dragDirection = sourceIndex < targetIndex ? "down" : "up";
        

        if  ((dragDirection === "up" && mousePosition.y < targetMiddleY) ||
            (dragDirection === "down" && mousePosition.y > targetMiddleY )) {
            console.log(monitor.getItem().name + '('+sourceIndex+') : ' + props.name+ '('+targetIndex+') : ' + dragDirection);
            props.onReorder(sourceIndex, targetIndex);
            monitor.getItem().order = targetIndex;
        } else {
            return
        }
    
    }
}

const sourceCollect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const targetCollect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}


class EditExerciseCard extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    handleEditClick() {
        this.props.onEdit(this.props.id);
    }

    render() {
        const id = this.props.id;
        const name = this.props.name;
        const sets = this.props.sets;
        const handleEdit = this.props.onEdit;
        const connectDragSource = this.props.connectDragSource;
        const connectDropTarget = this.props.connectDropTarget;
        const isDragging = this.props.isDragging;
        const isOver = this.props.isOver;

        const editExerciseCardStyles = styles.editExerciseCard + ' ' +
        (isDragging ? styles.isDragging : '') + ' ' +
        (isOver ? styles.isOver : '');

        const handleTemplate = (
            connectDragSource(
            connectDropTarget(
                <div className={styles.handle}>
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 1H15M0 5.5H15M0 10H15" stroke="white"/>
                        </svg>
                </div>
        )));
        
        return (
            <div key={id} className={editExerciseCardStyles}>
                <div ref={this.ref} className={styles.wrapper}>
                    <div className={styles.buttonEdit} onClick={this.handleEditClick}>
                        <div className={styles.name}>{name}</div>
                        <div className={styles.sets}>× {sets} sets</div>
                    </div>
                    {handleTemplate}
                </div>
            </div>
        )
    }
}

export default flow(
    DragSource(types.EXERCISE, sourceSpecs, sourceCollect),
    DropTarget(types.EXERCISE, targetSpecs, targetCollect)
)(EditExerciseCard);