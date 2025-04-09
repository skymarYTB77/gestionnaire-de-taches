import { useRef } from 'react';
import Toggle from './Toggle';

const initTodoList = () => ({
  id: nanoid(),
  name: 'Nouvelle Liste',
  data: [],
  sort: null,
  filter: null,
});

function LeftContainer(props) {
  const todoListNameRef = useRef(null);
  const activeList = props.todoLists.find(list => list.id === props.activeListId);
  const filterEnabled = activeList?.filter !== null;

  const handleFilterToggle = (enabled) => {
    const newTodoLists = props.todoLists.map(todoList => {
      if (todoList.id === props.activeListId) {
        return {...todoList, filter: enabled ? props.selectedDate || new Date() : null};
      }
      return todoList;
    });
    props.setTodoLists(newTodoLists);
  };

  return (
    <div className="w-48 h-full bg-neutral-800 border-r border-neutral-700 flex flex-col left-sidebar">
      <div className="mt-4 mb-6 ml-4">
        <h1 className="text-white text-xl font-bold">
          Gestionnaire
        </h1>
        <p className="text-neutral-400 text-sm">de tâches</p>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {props.todoLists.map((todoList) => (
          <TodoListItem
            key={todoList.id}
            todoList={todoList}
            isActive={todoList.id === props.activeListId}
            todoListNameRef={todoListNameRef}
            setActiveListId={props.setActiveListId}
            setTodoLists={props.setTodoLists}
            activeListId={props.activeListId}
          />
        ))}
      </div>
      <button
        className="w-40 mx-auto px-2 py-2 mt-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700/50 transition-all"
        onClick={() => {
          const newList = initTodoList();
          props.setTodoLists([...props.todoLists, newList]);
          props.setActiveListId(newList.id);
        }}
      >
        + Nouvelle Liste
      </button>
      <div className="p-4 border-t border-neutral-700 mt-4">
        <Toggle
          enabled={filterEnabled}
          setEnabled={handleFilterToggle}
          label="Filtre par date"
        />
      </div>
    </div>
  );
}

function TodoListItem({ todoList, isActive, todoListNameRef, setActiveListId, setTodoLists, activeListId }) {
  return (
    <div
      className={`w-40 mx-auto px-2 py-2 rounded-md flex justify-between
      font-semibold transition cursor-pointer group
      ${isActive ? 'bg-amber-200 text-neutral-900' : 'hover:bg-neutral-700/50 text-neutral-400'}`}
      onClick={() => setActiveListId(todoList.id)}
    >
      <input
        ref={isActive ? todoListNameRef : null}
        type="text"
        defaultValue={todoList.name}
        className={`w-32 bg-transparent outline-none cursor-pointer focus:cursor-text
          ${isActive ? 'text-neutral-900' : 'text-neutral-400'}
          ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onChange={() => {
          setTodoLists(prevLists => 
            prevLists.map(list =>
              list.id === activeListId
                ? { ...list, name: todoListNameRef.current.value }
                : list
            )
          );
        }}
      />
      <button
        className={`text-neutral-900 invisible ${isActive && 'group-hover:visible'}`}
        onClick={(e) => {
          e.stopPropagation();
          setTodoLists(prevLists => {
            const newLists = prevLists.filter(list => list.id !== activeListId);
            if (newLists.length === 0) {
              const newList = initTodoList();
              setActiveListId(newList.id);
              return [newList];
            }
            setActiveListId(newLists[0].id);
            return newLists;
          });
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default LeftContainer;