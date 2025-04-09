import { nanoid } from 'nanoid';
import { useRef } from 'react';
import Toggle from './Toggle';

const initTodoList = () => (
  {
    id: nanoid(),
    name: 'Nouvelle Liste',
    data: [],
    sort: null,
    filter: null,
  }
);

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
    <div className="w-48 h-full bg-neutral-800 border-r border-neutral-700 flex flex-col">
      <div className="mt-4 mb-6 ml-4">
        <h1 className="text-white text-xl font-bold">
          Gestionnaire
        </h1>
        <p className="text-neutral-400 text-sm">de tâches</p>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {
          props.todoLists.map((todoList) => {
            const isActive = todoList.id === props.activeListId;
            return (
              <div
                className={`w-40 mx-auto px-2 py-2 rounded-md flex justify-between
                font-semibold transition cursor-pointer group
                ${isActive ? 'bg-yellow text-neutral-900' : 'bg-neutral-700/50 text-neutral-400'}`}
                key={todoList.id}
                onClick={() => {
                  props.setActiveListId(todoList.id);
                }}
              >
                <input
                  ref={isActive ? todoListNameRef : null}
                  type="text"
                  defaultValue={todoList.name}
                  className={`w-32 bg-transparent outline-none cursor-pointer focus:cursor-text
                    ${isActive ? 'text-neutral-900' : 'text-neutral-400'}
                    ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  onChange={() => {
                    const newTodoLists = [...props.todoLists];
                    const index = newTodoLists.findIndex(list => list.id === props.activeListId);
                    if (index !== -1) {
                      newTodoLists[index] = {
                        ...newTodoLists[index],
                        name: todoListNameRef.current.value
                      };
                      props.setTodoLists(newTodoLists);
                    }
                  }}
                />
                <button
                  className={`text-neutral-900 invisible ${isActive && 'group-hover:visible'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTodoLists = props.todoLists.filter(list => list.id !== props.activeListId);
                    
                    if (newTodoLists.length === 0) {
                      const newList = initTodoList();
                      props.setTodoLists([newList]);
                      props.setActiveListId(newList.id);
                    } else {
                      props.setActiveListId(newTodoLists[0].id);
                      props.setTodoLists(newTodoLists);
                    }
                  }}
                >
                  ✕
                </button>
              </div>
            )
          })
        }
      </div>
      <button
        className="text-white w-40 px-2 py-2 mx-auto block mt-2"
        onClick={() => {
          props.setTodoLists([...props.todoLists, initTodoList()]);
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

export default LeftContainer;