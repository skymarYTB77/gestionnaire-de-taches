import React, { useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './TaskManager';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDraggable } from '@dnd-kit/core';

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDraggableRef,
    transform: dragTransform,
  } = useDraggable({
    id: `${task.id}-drag`,
  });

  const style = {
    transform: CSS.Transform.toString(transform || dragTransform),
    transition,
  };

  const ref = (node: HTMLDivElement) => {
    setSortableRef(node);
    setDraggableRef(node);
  };

  return (
    <div
      ref={ref}
      style={style}
      {...attributes}
      {...dragAttributes}
      {...listeners}
      {...dragListeners}
      className="task-card"
    >
      <label className="task-checkbox">
        <input
          type="checkbox"
          onChange={onDelete}
          className="task-checkbox-input"
        />
        <span className="checkmark"></span>
      </label>
      <div className="task-content">
        <h4>{task.title}</h4>
        <div className="task-due-date">
          <span>{format(new Date(task.dueDate), 'dd MMMM yyyy', { locale: fr })}</span>
        </div>
      </div>
    </div>
  );
}