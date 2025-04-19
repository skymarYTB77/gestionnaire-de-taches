'use client';

import { useState, useEffect } from 'react';
import TodoCreator from '../components/TodoCreator/index';
import LeftContainer from '../components/LeftContainer';
import MidContainer from '../components/MidContainer';
import RightContainer from '../components/RightContainer';
import Settings from '../components/Settings';
import { nanoid } from 'nanoid';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const initTodo = {
  name: '',
  priority: 'low',
  dateStart: '',
  tags: [],
  checked: false
};

const initTodoList = () => ({
  id: nanoid(),
  name: 'Nouvelle Liste',
  data: [],
  sort: null,
  filter: null,
  backgroundColor: 'amber-200'
});

function App() {
  const [creatorState, setCreatorState] = useState('hidden');
  const [todoLists, setTodoLists] = useState([initTodoList()]);
  const [activeListId, setActiveListId] = useState(todoLists[0].id);
  const [displayedTodo, setDisplayedTodo] = useState(initTodo);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastSelectedDate, setLastSelectedDate] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowLeftSidebar(false);
      } else {
        setShowLeftSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        if (userData.todoLists) {
          setTodoLists(userData.todoLists);
          setActiveListId(userData.todoLists[0].id);
        }
      } else {
        setTodoLists([initTodoList()]);
        setActiveListId(todoLists[0].id);
      }
    }, (error) => {
      console.error("Error loading data from Firestore:", error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const saveToFirestore = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { todoLists }, { merge: true });
      } catch (error) {
        console.error("Error saving to Firestore:", error);
      }
    };

    saveToFirestore();
  }, [todoLists, user]);

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
  }

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
    isMobile,
    showLeftSidebar,
    setShowLeftSidebar,
  };

  const midContainerProps = {
    todoLists,
    setTodoLists,
    creatorState,
    setCreatorState,
    setDisplayedTodo,
    activeListId,
    isMobile,
    showLeftSidebar,
    setShowLeftSidebar,
  };

  const rightContainerProps = {
    todoLists,
    setTodoLists,
    activeListId,
    setSelectedDate,
  };

  const activeList = todoLists.find(list => list.id === activeListId);
  const showCalendar = activeList?.filter !== null && !isMobile;

  if (loading || !user) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-bg">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-dark-bg">
      <div className="w-full h-full md:w-[900px] md:h-[600px] glass-effect rounded-xl neon-shadow flex overflow-hidden relative">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors flex items-center justify-center text-white z-10"
        >
          ⚙️
        </button>
        {creatorState!=='hidden' && <TodoCreator {...todoCreatorProps} />}
        {(showLeftSidebar || !isMobile) && <LeftContainer {...leftContainerProps} />}
        <MidContainer {...midContainerProps} showCalendar={showCalendar} />
        {showCalendar && <RightContainer {...rightContainerProps} />}
      </div>
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        todoLists={todoLists}
        setTodoLists={setTodoLists}
      />
    </div>
  );
}

export default App;