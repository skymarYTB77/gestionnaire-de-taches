import Calendar from "./Calendar";

function RightContainer(props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-72 h-full bg-neutral-800 border-l border-neutral-700">
      <Calendar
        date={today}
        todoLists={props.todoLists}
        setTodoLists={props.setTodoLists}
        activeListId={props.activeListId}
        setSelectedDate={props.setSelectedDate}
      />
      <div className="w-full flex justify-around mt-2 mb-6">
        <button 
          className="text-white bg-neutral-700 hover:bg-neutral-600 transition rounded-md p-1"
          onClick={() => {
            const newTodoLists = props.todoLists.map(todoList => {
              if (todoList.id === props.activeListId) {
                return {...todoList, filter: null};
              }
              return todoList;
            })
            props.setTodoLists(newTodoLists);
            props.setSelectedDate(null);
          }}
        >
          Effacer le filtre
        </button>
      </div>
    </div>
  );
}

export default RightContainer;