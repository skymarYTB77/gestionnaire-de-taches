import TodoList from './TodoList';
import Todo from './Todo';
import SortButton from './SortButton';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';

function MidContainer(props) {
  const [showSort, setShowSort] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  let ref = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSort(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    }
  }, [ref]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      let isDown = false;
      let startX;
      let scrollLeft;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });
    }
  }, []);

  function mapTodo(todo) {
    if (searchTerm && !todo.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }
    return (
      <Todo
        todo={todo}
        todoLists={props.todoLists}
        setTodoLists={props.setTodoLists}
        activeListId={props.activeListId}
        key={nanoid()}
        creatorState={props.creatorState}
        setCreatorState={props.setCreatorState}
        setDisplayedTodo={props.setDisplayedTodo}
      />
    )
  }

  const activeList = props.todoLists.find(list => list.id === props.activeListId);
  const todos = activeList ? activeList.data : [];
  const sortType = activeList?.sort;

  function sortTodos(todosToSort) {
    if (!sortType) return todosToSort;

    return [...todosToSort].sort((a, b) => {
      if (sortType === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortType === 'priority') {
        const priorityValues = { high: 0, mid: 1, low: 2 };
        return priorityValues[a.priority] - priorityValues[b.priority];
      }
      return 0;
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - today.getDay()));
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const noDateTodos = sortTodos(todos.filter(todo => !todo.dateStart));
  const todayTodos = sortTodos(todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate.toDateString() === today.toDateString();
  }));
  const tomorrowTodos = sortTodos(todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate.toDateString() === tomorrow.toDateString();
  }));
  const weekTodos = sortTodos(todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate > tomorrow && todoDate <= endOfWeek;
  }));
  const monthTodos = sortTodos(todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate > endOfWeek && todoDate <= endOfMonth;
  }));
  const yearTodos = sortTodos(todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate > endOfMonth && todoDate <= endOfYear;
  }));

  const allTodos = sortTodos(todos.filter(todo => !todo.checked));
  const completedTodos = sortTodos(todos.filter(todo => todo.checked));

  const columns = [
    { title: "En vrac", todos: noDateTodos, icon: "📝", color: "bg-blue-500" },
    { title: "Aujourd'hui", todos: todayTodos, icon: "⭐", color: "bg-amber-500" },
    { title: "Demain", todos: tomorrowTodos, icon: "🌅", color: "bg-orange-500" },
    { title: "Cette semaine", todos: weekTodos, icon: "📅", color: "bg-green-500" },
    { title: "Ce mois-ci", todos: monthTodos, icon: "📆", color: "bg-purple-500" },
    { title: "Cette année", todos: yearTodos, icon: "🗓️", color: "bg-pink-500" }
  ];

  const Column = ({ title, todos, icon, color }) => (
    <details className="flex-none w-[220px] bg-neutral-800/50 rounded-xl p-4 shadow-lg group">
      <summary className="cursor-pointer list-none">
        <div className={`flex items-center gap-2 mb-2`}>
          <span className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
            {icon}
          </span>
          <h2 className="text-white font-semibold">{title}</h2>
          <span className="ml-auto text-neutral-400 text-sm">
            {todos.length}
          </span>
        </div>
      </summary>
      <div className="pt-2 max-h-[200px] overflow-y-auto">
        {todos.map(mapTodo)}
        {todos.length === 0 && (
          <div className="text-neutral-400 text-sm text-center mt-4">
            Aucune tâche
          </div>
        )}
      </div>
    </details>
  );

  const WideColumn = ({ title, todos, icon, color }) => (
    <details open className="flex-1 bg-neutral-800/50 rounded-xl p-4 shadow-lg">
      <summary className="cursor-pointer list-none">
        <div className={`flex items-center gap-2 mb-2`}>
          <span className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
            {icon}
          </span>
          <h2 className="text-white font-semibold">{title}</h2>
          <span className="ml-auto text-neutral-400 text-sm">
            {todos.length}
          </span>
        </div>
      </summary>
      <div className="pt-2 max-h-[300px] overflow-y-auto">
        {todos.map(mapTodo)}
        {todos.length === 0 && (
          <div className="text-neutral-400 text-sm text-center mt-4">
            Aucune tâche
          </div>
        )}
      </div>
    </details>
  );

  return (
    <div className="flex-1 h-full">
      <div className="flex flex-col h-full">
        <div className="p-4 flex gap-3 items-center">
          {props.isMobile && !props.showLeftSidebar && (
            <button
              onClick={() => props.setShowLeftSidebar(true)}
              className="w-8 h-8 flex items-center justify-center text-white"
            >
              ☰
            </button>
          )}
          <button
            className="h-9 rounded-md px-4 py-2 text-neutral-300 bg-neutral-900 hover:bg-neutral-800 transition-all"
            onClick={() => {
              props.setCreatorState('add');
            }}
          >
            + Ajouter une tâche
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              className="w-full h-9 px-4 rounded-md bg-neutral-900 text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className="h-9 rounded-md px-4 py-2 relative cursor-pointer
            text-neutral-300 bg-neutral-900 hover:bg-neutral-800 transition-all"
            onClick={() => {
              setShowSort(true);
            }}
          >
            Trier
            {showSort &&
              <div
                ref={ref}
                className="absolute w-24 p-2 flex flex-col gap-1 items-start rounded-sm bg-neutral-700 top-9 z-10"
              >
                <SortButton
                  name="Nom"
                  todoLists={props.todoLists}
                  setTodoLists={props.setTodoLists}
                  activeListId={props.activeListId}
                  value={'name'}
                />
                <SortButton
                  name="Priorité"
                  todoLists={props.todoLists}
                  setTodoLists={props.setTodoLists}
                  activeListId={props.activeListId}
                  value={'priority'}
                />
              </div>
            }
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {props.showCalendar ? (
            <TodoList
              todoLists={props.todoLists}
              activeListId={props.activeListId}
              mapTodo={mapTodo}
            />
          ) : (
            <div className="flex flex-col h-full">
              <div 
                ref={scrollContainerRef}
                className="p-4 grid grid-cols-3 gap-6 auto-rows-min bg-neutral-900/30"
              >
                {columns.map((column, index) => (
                  <Column 
                    key={index}
                    title={column.title}
                    todos={column.todos}
                    icon={column.icon}
                    color={column.color}
                  />
                ))}
              </div>
              <div className="h-px bg-neutral-700 mx-4" />
              <div className="flex-1 p-4">
                <div className="grid grid-cols-2 gap-6">
                  <WideColumn
                    title="Tous"
                    todos={allTodos}
                    icon="📋"
                    color="bg-indigo-500"
                  />
                  <WideColumn
                    title="Terminées"
                    todos={completedTodos}
                    icon="✅"
                    color="bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MidContainer;