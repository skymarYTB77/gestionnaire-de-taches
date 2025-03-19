import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanBoard } from './KanbanBoard';
import { ListView } from './ListView';
import { Layout, List, Plus, X } from 'lucide-react';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../styles/TaskManager.css';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  column: 'today' | 'thisWeek' | 'thisMonth';
  createdAt: string;
}

interface TaskManagerProps {
  onClose: () => void;
}

export function TaskManager({ onClose }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [message, setMessage] = useState<string | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }

    const taskId = active.id as string;
    const newColumn = over.data.current?.column;

    if (newColumn) {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, column: newColumn } : task
      ));
    }
  };

  const addNewTask = () => {
    if (!newTaskTitle.trim() || !newTaskDueDate) {
      showTemporaryMessage('Veuillez remplir tous les champs');
      return;
    }

    const dueDate = parseISO(newTaskDueDate);
    let column: Task['column'] = 'thisMonth';

    if (isToday(dueDate)) {
      column = 'today';
    } else if (isThisWeek(dueDate)) {
      column = 'thisWeek';
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      dueDate: newTaskDueDate,
      column,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDueDate(format(new Date(), 'yyyy-MM-dd'));
    setShowNewTaskModal(false);
    showTemporaryMessage('Tâche ajoutée avec succès !');
  };

  const confirmDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirmModal(true);
  };

  const deleteTask = () => {
    if (!taskToDelete) return;

    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
    setShowDeleteConfirmModal(false);
    setTaskToDelete(null);
    showTemporaryMessage('Tâche supprimée !');
  };

  return (
    <div className="task-manager-overlay">
      <div className="task-manager-container">
        <div className="task-manager-header">
          <h2>Gestionnaire de tâches</h2>
          <div className="task-manager-actions">
            <button
              className="add-task-button"
              onClick={() => setShowNewTaskModal(true)}
            >
              <Plus size={16} />
              <span>Nouvelle tâche</span>
            </button>
            <button
              className="view-mode-toggle"
              onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
              title={viewMode === 'kanban' ? 'Vue liste' : 'Vue kanban'}
            >
              {viewMode === 'kanban' ? <List size={20} /> : <Layout size={20} />}
            </button>
            <button className="close-task-manager" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <DndContext 
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {viewMode === 'kanban' ? (
              <KanbanBoard tasks={tasks} onDeleteTask={confirmDeleteTask} />
            ) : (
              <ListView tasks={tasks} onDeleteTask={confirmDeleteTask} />
            )}
          </SortableContext>
        </DndContext>
      </div>

      {showNewTaskModal && (
        <div className="modal">
          <div className="modal-content task-modal">
            <button className="close-modal" onClick={() => setShowNewTaskModal(false)}>
              <X size={24} />
            </button>
            <h3>Nouvelle tâche</h3>
            <div className="task-form">
              <div className="form-group">
                <label>Titre <span className="required">*</span></label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date d'échéance <span className="required">*</span></label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="task-form-actions">
                <button onClick={() => setShowNewTaskModal(false)}>Annuler</button>
                <button onClick={addNewTask} className="save-task">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="modal">
          <div className="modal-content task-modal">
            <button className="close-modal" onClick={() => {
              setShowDeleteConfirmModal(false);
              setTaskToDelete(null);
            }}>
              <X size={24} />
            </button>
            <h3>Confirmer la suppression</h3>
            <p className="delete-confirmation-text">
              Êtes-vous sûr de vouloir supprimer cette tâche ?
              Cette action est irréversible.
            </p>
            <div className="delete-confirmation-actions">
              <button 
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setTaskToDelete(null);
                }}
                className="cancel-delete"
              >
                Annuler
              </button>
              <button 
                onClick={deleteTask}
                className="confirm-delete"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="task-message">
          {message}
        </div>
      )}
    </div>
  );
}