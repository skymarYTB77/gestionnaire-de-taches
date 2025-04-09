'use client';

import { useState, useEffect } from 'react';
import TodoCreator from '../components/TodoCreator/index';
import LeftContainer from '../components/LeftContainer';
import MidContainer from '../components/MidContainer';
import RightContainer from '../components/RightContainer';
import { nanoid } from 'nanoid';

const initTodo = {
  name: '',
  priority: 'low',
  dateStart: '',
  tags: [],
  checked: false
};

const initTodoList = () => (
  {
    id: nanoid(),
    name: 'Nouvelle Liste',
    data: [],
    sort: null,
    filter: null,
  }
);

function App() {
  const [creatorState, setCreatorState] = useState('hidden');
  const [todoLists, setTodoLists] = useState([initTodoList()]);
  const [activeListId, setActiveListId] = useState(todoLists[0].id);
  const [displayedTodo, setDisplayedTodo] = useState(initTodo);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastSelectedDate, setLastSelectedDate] = useState(null);

  useEffect(() => {
    if (localStorage) {
      const savedTodoLists = JSON.parse(localStorage.getItem('todoLists'));
      if (savedTodoLists) {
        setTodoLists(savedTodoLists);
        setActiveListId(savedTodoLists[0].id);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todoLists', JSON.stringify(todoLists));
  }, [todoLists]);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDisplayedTodo(prev => ({...prev, dateStart: formattedDate}));
      setLastSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (creatorState === 'add' && lastSelectedDate && todoLists.find(list => list.id === activeListId)?.filter) {
      const formattedDate = lastSelectedDate.toISOString().split('T')[0];
      setDisplayedTodo(prev => ({...prev, dateStart: formattedDate}));
    }
  }, [creatorState]);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setCreatorState('hidden');
      setDisplayedTodo(initTodo);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [creatorState]);

  const todoCreatorProps = {
    todoLists,
    setTodoLists,
    activeListId,
    creatorState,
    setCreatorState,
    displayedTodo,
    setDisplayedTodo,
  };

  const leftContainerProps = {
    todoLists,
    setTodoLists,
    activeListId,
    setActiveListId,
    selectedDate,
  };

  const midContainerProps = {
    todoLists,
    setTodoLists,
    creatorState,
    setCreatorState,
    setDisplayedTodo,
    activeListId
  };

  const rightContainerProps = {
    todoLists,
    setTodoLists,
    activeListId,
    setSelectedDate,
  };

  const activeList = todoLists.find(list => list.id === activeListId);
  const showCalendar = activeList?.filter !== null;

  return (
    <div className="font-sans w-screen h-screen flex items-center justify-center bg-neutral-900/80">
      <div className="w-[900px] h-[600px] bg-neutral-900 rounded-xl shadow-2xl flex overflow-hidden">
        {creatorState!=='hidden' && <TodoCreator {...todoCreatorProps} />}
        <LeftContainer {...leftContainerProps} />
        <MidContainer {...midContainerProps} showCalendar={showCalendar} />
        {showCalendar && <RightContainer {...rightContainerProps} />}
      </div>
    </div>
  );
}

export default App;