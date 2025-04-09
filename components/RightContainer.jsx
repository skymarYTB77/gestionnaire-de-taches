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
    </div>
  );
}

export default RightContainer