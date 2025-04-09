import TodoList from './TodoList';
import Todo from './Todo';
import SortButton from './SortButton';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';

function MidContainer(props) {
  const [showSort, setShowSort] = useState(false);
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - today.getDay()));
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const noDateTodos = todos.filter(todo => !todo.dateStart);
  const todayTodos = todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate.toDateString() === today.toDateString();
  });
  const tomorrowTodos = todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate.toDateString() === tomorrow.toDateString();
  });
  const weekTodos = todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate > tomorrow && todoDate <= endOfWeek;
  });
  const monthTodos = todos.filter(todo => {
    if (!todo.dateStart) return false;
    const todoDate = new Date(todo.dateStart);
    return todoDate > endOfWeek && todoDate <= endOfMonth;
  });

  const Column = ({ title, todos }) => (
    <div className="flex-none w-[280px] bg-neutral-800/50 rounded-xl p-4 shadow-lg">
      <h2 className="text-white font-semibold mb-4 px-2">{title}</h2>
      <div className="h-[calc(100%-2rem)] overflow-y-auto">
        {todos.map(mapTodo)}
        {todos.length === 0 && (
          <div className="text-neutral-400 text-sm text-center mt-4">
            Aucune tâche
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-full">
      <div className="flex flex-col h-full">
        <div className="p-4 flex gap-3">
          <button
            className="h-9 rounded-md px-4 py-2
            text-neutral-300 bg-neutral-900 hover:bg-neutral-800 transition-all"
            onClick={() => {
              props.setCreatorState('add');
            }}
          >
            + Ajouter une tâche
          </button>
          <div
            className="h-9 rounded-md px-4 py-2 relative ml-auto cursor-pointer
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
                  name="Aucun"
                  todoLists={props.todoLists}
                  setTodoLists={props.setTodoLists}
                  activeListId={props.activeListId}
                  value={null}
                />
                <SortButton
                  name="Nom"
                  todoLists={props.todoLists}
                  setTodoLists={props.setTodoLists}
                  activeListId={props.activeListId}
                  value={'name'}
                />
                <SortButton
                  name="Date"
                  todoLists={props.todoLists}
                  setTodoLists={props.setTodoLists}
                  activeListId={props.activeListId}
                  value={'date'}
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
        <div className="flex-1 overflow-hidden p-4">
          {props.showCalendar ? (
            <TodoList
              todoLists={props.todoLists}
              activeListId={props.activeListId}
              mapTodo={mapTodo}
            />
          ) : (
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 h-[calc(100%-2rem)] overflow-x-auto pb-4 cursor-grab"
            >
              <Column title="En vrac" todos={noDateTodos} />
              <Column title="Aujourd'hui" todos={todayTodos} />
              <Column title="Demain" todos={tomorrowTodos} />
              <Column title="Cette semaine" todos={weekTodos} />
              <Column title="Ce mois-ci" todos={monthTodos} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MidContainer;