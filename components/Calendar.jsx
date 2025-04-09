import { nanoid } from "nanoid";
import { useState } from "react";

function Calendar(props) {
  const [date, setDate] = useState(props.date);

  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const titles = ["D", "L", "M", "M", "J", "V", "S"];

  let y = date.getFullYear(), m = date.getMonth();
  let start = new Date(y, m, 1).getDay();
  let end = new Date(y, m + 1, 0).getDate();

  let days = [];
  for(let i = 0; i < 6; i++) {
    days[i] = [];
    for(let j = 0; j < 7; j++) {
      const date = 7*i + j-start + 1;
      days[i][j] = (date>=1 && date<=end) ? date : 0;
    }
  }

  function handleClickLeft() {
    const d = new Date(date)
    if (d.getMonth() == 0) {
      d.setFullYear(d.getFullYear()-1);
      d.setMonth(11);
    } else {
      d.setMonth(d.getMonth()-1);
    }
    setDate(d);
  }

  function handleClickRight() {
    const d = new Date(date)
    if (d.getMonth() == 11) {
      d.setFullYear(d.getFullYear()+1);
      d.setMonth(0);
    } else {
      d.setMonth(d.getMonth()+1);
    }
    setDate(d);
  }

  const activeList = props.todoLists.filter(todoList => (
    todoList.id === props.activeListId
  ))[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const content = (
    <div className="rounded-md">
      <div className="text-white flex justify-around items-center mb-4">
        <button
          className="hover:scale-125 h-min transition"
          onClick={handleClickLeft}
        >
          ◀
        </button>
        <div className="text-center text-lg font-semibold">
          <div>{y}</div>
          <div>{months[m]}</div>
        </div>
        <button
          className="hover:scale-125 h-min transition"
          onClick={handleClickRight}
        >
          ▶
        </button>
      </div>
      <div className="text-white h-max py-2 rounded-md">
        <div className="grid grid-cols-7 gap-x-1 mb-2">
          {titles.map(title => (
            <div
              key={nanoid()}
              className="text-center text-sm font-semibold"
            >
              {title}
            </div>
          ))}
        </div>
        <div className="grid grid-rows-6 gap-y-1">
          {days.map((week, weekIndex) => (
            <div key={nanoid()} className="grid grid-cols-7 gap-x-1">
              {week.map((d, dayIndex) => {
                const currentDate = new Date(date.getFullYear(), date.getMonth(), d);
                currentDate.setHours(0, 0, 0, 0);

                let buttonClasses = "w-8 h-8 text-sm flex items-center justify-center rounded-full transition";
                
                if (d === 0) {
                  return <div key={nanoid()} className="w-8 h-8" />;
                }

                if (currentDate.getTime() < today.getTime()) {
                  buttonClasses += " opacity-50";
                }

                if (currentDate.getTime() === today.getTime()) {
                  buttonClasses += " bg-yellow text-black ring-2 ring-yellow font-bold";
                } else if (activeList && new Date(activeList.filter).getTime() === currentDate.getTime()) {
                  buttonClasses += " bg-yellow text-black";
                } else {
                  buttonClasses += " bg-neutral-800 hover:bg-neutral-700";
                }

                return (
                  <button
                    key={nanoid()}
                    className={buttonClasses}
                    onClick={() => {
                      const newTodoLists = props.todoLists.map(todoList => {
                        if (todoList.id === props.activeListId) {
                          return {...todoList, filter: currentDate};
                        }
                        return todoList;
                      })
                      props.setTodoLists(newTodoLists);
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col p-4 rounded-md">
      {content}
    </div>
  );
}

export default Calendar;