import Checkbox from '../Checkbox';
import Date from './Date';
import Tags from './Tags';

function Todo(props) {
  const handleClick = () => {
    if (props.todo.dateStart) {
      // Mettre à jour le filtre de la liste active avec la date de la tâche
      const newTodoLists = props.todoLists.map(todoList => {
        if (todoList.id === props.activeListId) {
          return {
            ...todoList,
            filter: new Date(props.todo.dateStart)
          };
        }
        return todoList;
      });
      props.setTodoLists(newTodoLists);
    }

    props.setCreatorState('edit');
    props.setDisplayedTodo(props.todo);
  };

  return (
    <div
      className="w-full px-3 py-2 mb-2 rounded-lg bg-neutral-800 text-white relative
      flex items-center gap-3 cursor-pointer group hover:bg-neutral-700/50 transition-colors"
      onClick={handleClick}
    >
      <button
        className="absolute right-3 top-2
        text-neutral-800 group-hover:text-neutral-300 transition"
        onClick={(e) => {
          const newTodoLists = props.todoLists.map(todoList => {
            if (todoList.id === props.activeListId) {
              const newTodoListData = todoList.data.filter(todo => todo !== props.todo);
              return {...todoList, data: newTodoListData};
            }
            return todoList;
          })
          props.setTodoLists(newTodoLists);

          e.stopPropagation();
        }}
      >
        ✕
      </button>
      <Checkbox
        todo={props.todo}
        todoLists={props.todoLists}
        setTodoLists={props.setTodoLists}
        activeListId={props.activeListId}
        checked={props.todo.checked}
        priority={props.todo.priority}
      />
      <div className="flex flex-col w-full justify-center py-1">
        <div className={`text-sm ${props.todo.checked && 'line-through'}`}>
          {props.todo.name}
        </div>
        <div className="flex flex-row w-full justify-between">
          <Date
            dateStart={props.todo.dateStart}
            dateEnd={props.todo.dateEnd}
          />
          <Tags tags={props.todo.tags} />
        </div>
      </div>
    </div>
  );
}

export default Todo;