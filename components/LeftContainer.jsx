import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import Toggle from './Toggle';
import ContextMenu from './ContextMenu';

const initTodoList = () => ({
  id: nanoid(),
  name: 'Nouvelle Liste',
  data: [],
  sort: null,
  filter: null,
});

const initCategory = () => ({
  id: nanoid(),
  name: 'Nouvelle Catégorie',
  lists: [],
  isOpen: true,
});

function LeftContainer(props) {
  const [contextMenu, setContextMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [draggedList, setDraggedList] = useState(null);
  const [dragOverCategory, setDragOverCategory] = useState(null);
  const todoListNameRef = useRef(null);
  const categoryNameRef = useRef(null);

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

  const handleContextMenu = (e, type, id = null) => {
    e.preventDefault();
    let options = [];

    if (type === 'list') {
      options = [
        {
          label: 'Déplacer vers...',
          icon: '📦',
          onClick: () => {
            // Afficher les catégories disponibles
            const categoryOptions = categories.map(category => ({
              label: category.name,
              icon: '📁',
              onClick: () => {
                props.setTodoLists(prevLists =>
                  prevLists.map(list =>
                    list.id === id
                      ? { ...list, categoryId: category.id }
                      : list
                  )
                );
              }
            }));
            
            if (categoryOptions.length > 0) {
              setContextMenu({
                x: e.clientX,
                y: e.clientY,
                options: [
                  ...categoryOptions,
                  {
                    label: 'Sans catégorie',
                    icon: '🗑️',
                    onClick: () => {
                      props.setTodoLists(prevLists =>
                        prevLists.map(list =>
                          list.id === id
                            ? { ...list, categoryId: null }
                            : list
                        )
                      );
                    }
                  }
                ]
              });
            }
          }
        },
        {
          label: 'Supprimer',
          icon: '🗑️',
          onClick: () => {
            props.setTodoLists(prevLists => {
              const newLists = prevLists.filter(list => list.id !== id);
              if (newLists.length === 0) {
                const newList = initTodoList();
                props.setActiveListId(newList.id);
                return [newList];
              }
              props.setActiveListId(newLists[0].id);
              return newLists;
            });
          }
        }
      ];
    } else {
      options = [
        {
          label: 'Nouvelle Liste',
          icon: '📝',
          onClick: () => {
            const newList = initTodoList();
            props.setTodoLists([...props.todoLists, newList]);
            props.setActiveListId(newList.id);
          }
        },
        {
          label: 'Nouvelle Catégorie',
          icon: '📁',
          onClick: () => {
            setCategories([...categories, initCategory()]);
          }
        }
      ];
    }

    setContextMenu({ x: e.clientX, y: e.clientY, options });
  };

  const handleDragStart = (e, listId) => {
    setDraggedList(listId);
    e.dataTransfer.setData('text/plain', listId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, categoryId = null) => {
    e.preventDefault();
    setDragOverCategory(categoryId);
  };

  const handleDrop = (e, categoryId = null) => {
    e.preventDefault();
    if (draggedList) {
      props.setTodoLists(prevLists =>
        prevLists.map(list =>
          list.id === draggedList
            ? { ...list, categoryId }
            : list
        )
      );
    }
    setDraggedList(null);
    setDragOverCategory(null);
  };

  return (
    <div 
      className="w-48 h-full bg-neutral-800 border-r border-neutral-700 flex flex-col"
      onContextMenu={(e) => handleContextMenu(e, 'sidebar')}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
    >
      <div className="mt-4 mb-6 ml-4">
        <h1 className="text-white text-xl font-bold">
          Gestionnaire
        </h1>
        <p className="text-neutral-400 text-sm">de tâches</p>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={`mb-2 ${dragOverCategory === category.id ? 'bg-neutral-700/30' : ''}`}
            onDragOver={(e) => handleDragOver(e, category.id)}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            <div className="w-40 mx-auto px-2 py-1 text-neutral-400 flex items-center gap-2 group">
              <button
                className="w-4 h-4 flex items-center justify-center text-xs"
                onClick={() => {
                  setCategories(categories.map(c => 
                    c.id === category.id ? {...c, isOpen: !c.isOpen} : c
                  ));
                }}
              >
                {category.isOpen ? '▼' : '▶'}
              </button>
              <input
                ref={categoryNameRef}
                type="text"
                defaultValue={category.name}
                className="bg-transparent outline-none text-sm font-medium"
                onChange={(e) => {
                  setCategories(categories.map(c =>
                    c.id === category.id ? {...c, name: e.target.value} : c
                  ));
                }}
              />
              <button
                className="ml-auto text-xs opacity-0 group-hover:opacity-100"
                onClick={() => {
                  setCategories(categories.filter(c => c.id !== category.id));
                }}
              >
                ✕
              </button>
            </div>
            {category.isOpen && (
              <div className="ml-6">
                {props.todoLists
                  .filter(list => list.categoryId === category.id)
                  .map((todoList) => (
                    <TodoListItem
                      key={todoList.id}
                      todoList={todoList}
                      isActive={todoList.id === props.activeListId}
                      todoListNameRef={todoListNameRef}
                      setActiveListId={props.setActiveListId}
                      setTodoLists={props.setTodoLists}
                      activeListId={props.activeListId}
                      onContextMenu={handleContextMenu}
                      onDragStart={handleDragStart}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
        {props.todoLists
          .filter(list => !list.categoryId)
          .map((todoList) => (
            <TodoListItem
              key={todoList.id}
              todoList={todoList}
              isActive={todoList.id === props.activeListId}
              todoListNameRef={todoListNameRef}
              setActiveListId={props.setActiveListId}
              setTodoLists={props.setTodoLists}
              activeListId={props.activeListId}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
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
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

function TodoListItem({ todoList, isActive, todoListNameRef, setActiveListId, setTodoLists, activeListId, onContextMenu, onDragStart }) {
  return (
    <div
      className={`w-40 mx-auto px-2 py-2 rounded-md flex justify-between
      font-semibold transition cursor-pointer group
      ${isActive ? 'bg-amber-200 text-neutral-900' : 'hover:bg-neutral-700/50 text-neutral-400'}`}
      onClick={() => setActiveListId(todoList.id)}
      onContextMenu={(e) => onContextMenu(e, 'list', todoList.id)}
      draggable
      onDragStart={(e) => onDragStart(e, todoList.id)}
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