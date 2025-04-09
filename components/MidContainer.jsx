import TodoList from './TodoList';
import Todo from './Todo';
import SortButton from './SortButton';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';

function MidContainer(props) {
  const [showSort, setShowSort] = useState(false);
  let ref = useRef(null);

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
  }, [ref])

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

  return (
    <div className="flex-1 h-full">
      <div className="flex flex-col items-center pt-4 gap-2">
        <div className="w-[28rem] flex gap-3">
          <button
            className="w-auto h-7 rounded-md px-2 py-0
            text-neutral-300 bg-neutral-900 hover:bg-neutral-800 transition-all"
            onClick={() => {
              props.setCreatorState('add');
            }}
          >
            + Ajouter une tâche
          </button>
          <div
            className="w-auto h-7 rounded-md px-2 py-0 relative ml-auto cursor-pointer
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
        <div className="h-[520px] overflow-y-auto w-full px-4">
          <TodoList
            todoLists={props.todoLists}
            activeListId={props.activeListId}
            mapTodo={mapTodo}
          />
        </div>
      </div>
    </div>
  );
}

export default MidContainer;