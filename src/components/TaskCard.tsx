import React, { useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './TaskManager';
import { Trash2 } from 'lucide-react';
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

  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startX.current = e.touches[0].clientX;
      currentX.current = 0;
      card.style.transition = 'none';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.touches[0].clientX - startX.current;
      currentX.current = Math.min(0, deltaX);
      card.style.transform = `translateX(${currentX.current}px)`;

      if (currentX.current < -100) {
        card.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      } else {
        card.style.backgroundColor = '';
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      card.style.transition = 'all 0.3s';

      if (currentX.current < -100) {
        onDelete();
      } else {
        card.style.transform = 'translateX(0)';
        card.style.backgroundColor = '';
      }
    };

    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchmove', handleTouchMove);
    card.addEventListener('touchend', handleTouchEnd);

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onDelete]);

  const style = {
    transform: CSS.Transform.toString(transform || dragTransform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const ref = (node: HTMLDivElement) => {
    setSortableRef(node);
    setDraggableRef(node);
    cardRef.current = node;
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
      <button 
        className="delete-task"
        onClick={handleDelete}
        title="Supprimer la tâche"
      >
        <Trash2 size={20} />
      </button>
      <div className="task-content">
        <h4>{task.title}</h4>
        <div className="task-due-date">
          <span>{format(new Date(task.dueDate), 'dd MMMM yyyy', { locale: fr })}</span>
        </div>
      </div>
    </div>
  );
}